"""Measure the detector on a public dataset and commit the raw output.

Every number the project reports comes from this script. Nothing is estimated.

    python -m benchmarks.run_benchmark --dataset fakeavceleb --per-class 1000
"""

from __future__ import annotations

import argparse
import csv
import json
import random
import subprocess
import sys
import time
from collections.abc import Callable
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    precision_recall_curve,
    precision_recall_fscore_support,
    roc_auc_score,
)

from benchmarks.datasets import SPECS, DatasetSpec, all_splits_are_held_out
from deepverify.detector import DeepfakeDetector
from deepverify.faces import NoFaceDetectedError

RESULTS_DIR = Path(__file__).parent / "results"


def _git_sha() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], text=True, stderr=subprocess.DEVNULL
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def _label_reader(features):
    """Return a function mapping a raw label to its string name.

    Handles both plain string columns and ClassLabel integer columns.
    """
    names = getattr(features["label"], "names", None)
    if names is None:
        return lambda value: value
    return lambda value: names[value]


@dataclass
class Sample:
    """A balanced sample, held as labels plus a lazy image accessor.

    Images are fetched one batch at a time. Materialising every decoded image up
    front exhausts memory and drives the machine into swap.
    """

    labels: list[str]
    groups: list[str | None]
    fetch: Callable[[int], "Image.Image"]

    def __len__(self) -> int:
        return len(self.labels)


def load_balanced_sample(spec: DatasetSpec, per_class: int, seed: int, cache: Path) -> Sample:
    from datasets import concatenate_datasets, load_dataset

    rng = random.Random(seed)

    if spec.streaming:
        # Stream to disk rather than RAM: the whole point of streaming is to
        # avoid holding the set in memory, so don't hold the sample either.
        cache.mkdir(parents=True, exist_ok=True)
        stream = load_dataset(spec.repo, split=spec.splits[0], streaming=True)
        to_name = _label_reader(stream.features)

        counts = {"fake": 0, "real": 0}
        paths, labels, groups = [], [], []
        for row in stream.shuffle(seed=seed, buffer_size=5_000):
            name = to_name(row["label"])
            key = "fake" if name == spec.fake_label else "real"
            if counts[key] >= per_class:
                if all(v >= per_class for v in counts.values()):
                    break
                continue
            path = cache / f"{len(paths):06d}.png"
            row["image"].convert("RGB").save(path)
            paths.append(path)
            labels.append(name)
            groups.append(row.get(spec.group_column) if spec.group_column else None)
            counts[key] += 1

        return Sample(labels, groups, lambda i: Image.open(paths[i]))

    parts = [load_dataset(spec.repo, split=split) for split in spec.splits]
    data = concatenate_datasets(parts) if len(parts) > 1 else parts[0]
    to_name = _label_reader(data.features)

    fake_idx, real_idx = [], []
    for index, raw in enumerate(data["label"]):
        (fake_idx if to_name(raw) == spec.fake_label else real_idx).append(index)

    take = min(per_class, len(fake_idx), len(real_idx))
    if take < per_class:
        print(
            f"  note: only {take} per class available "
            f"({len(fake_idx)} fake, {len(real_idx)} real); using {take}",
            flush=True,
        )
    chosen = rng.sample(fake_idx, take) + rng.sample(real_idx, take)
    rng.shuffle(chosen)

    # Labels and group ids are cheap columns; images stay on disk until needed.
    label_column = data["label"]
    group_column = data[spec.group_column] if spec.group_column else None
    labels = [to_name(label_column[i]) for i in chosen]
    groups = [group_column[i] for i in chosen] if group_column else [None] * len(chosen)

    return Sample(labels, groups, lambda i: data[chosen[i]]["image"])


def score(
    detector: DeepfakeDetector, sample: Sample, spec: DatasetSpec, batch_size: int
) -> tuple[np.ndarray, np.ndarray, list[str | None], int]:
    scores, labels, groups = [], [], []
    skipped = 0

    started = time.time()
    for start in range(0, len(sample), batch_size):
        stop = min(start + batch_size, len(sample))
        images, kept = [], []

        for index in range(start, stop):
            image = sample.fetch(index).convert("RGB")
            if not spec.pre_cropped:
                try:
                    image = detector.crop_face(image)
                except NoFaceDetectedError:
                    skipped += 1
                    continue
            images.append(image)
            kept.append(index)

        if images:
            for probability, index in zip(detector.score_faces(images), kept, strict=True):
                scores.append(probability)
                labels.append(sample.labels[index])
                groups.append(sample.groups[index])

        rate = stop / max(time.time() - started, 1e-9)
        print(f"  scored {stop}/{len(sample)}  ({rate:.1f} img/s)", end="\r", flush=True)

    print()
    y_true = np.array([1 if name == spec.fake_label else 0 for name in labels])
    return np.array(scores), y_true, groups, skipped


def compute_metrics(y_true: np.ndarray, y_score: np.ndarray, threshold: float) -> dict:
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_score >= threshold, average="binary", zero_division=0
    )
    curve_p, curve_r, thresholds = precision_recall_curve(y_true, y_score)
    f1_curve = np.divide(
        2 * curve_p * curve_r,
        curve_p + curve_r,
        out=np.zeros_like(curve_p),
        where=(curve_p + curve_r) > 0,
    )
    best = int(np.argmax(f1_curve[:-1])) if len(thresholds) else 0
    tn, fp, fn, tp = confusion_matrix(y_true, y_score >= threshold, labels=[0, 1]).ravel()

    return {
        "roc_auc": float(roc_auc_score(y_true, y_score)),
        "pr_auc": float(average_precision_score(y_true, y_score)),
        "threshold_default": threshold,
        "precision_at_default": float(precision),
        "recall_at_default": float(recall),
        "f1_at_default": float(f1),
        "accuracy_at_default": float(((y_score >= threshold) == y_true).mean()),
        "confusion_at_default": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "best_f1": float(f1_curve[best]),
        "best_f1_threshold": float(thresholds[best]) if len(thresholds) else threshold,
        "best_f1_precision": float(curve_p[best]),
        "best_f1_recall": float(curve_r[best]),
        "n_fake": int(y_true.sum()),
        "n_real": int((1 - y_true).sum()),
    }


def video_level(y_true: np.ndarray, y_score: np.ndarray, groups: list[str | None]) -> dict | None:
    """Aggregate frames to their source video, as the upstream paper reports."""
    if not groups or any(g is None for g in groups):
        return None

    by_video: dict[str, list[tuple[int, float]]] = {}
    for group, truth, prediction in zip(groups, y_true, y_score, strict=True):
        by_video.setdefault(group, []).append((int(truth), float(prediction)))

    truths = np.array([v[0][0] for v in by_video.values()])
    means = np.array([float(np.mean([p for _, p in v])) for v in by_video.values()])
    if len(set(truths.tolist())) < 2:
        return None

    return {
        "n_videos": len(by_video),
        "n_fake_videos": int(truths.sum()),
        "n_real_videos": int((1 - truths).sum()),
        "roc_auc": float(roc_auc_score(truths, means)),
        "pr_auc": float(average_precision_score(truths, means)),
    }


def save_curves(y_true: np.ndarray, y_score: np.ndarray, spec: DatasetSpec, path: Path) -> None:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from sklearn.metrics import roc_curve

    fpr, tpr, _ = roc_curve(y_true, y_score)
    curve_p, curve_r, _ = precision_recall_curve(y_true, y_score)

    figure, (left, right) = plt.subplots(1, 2, figsize=(11, 4.5))
    left.plot(fpr, tpr, color="#6d3ae0")
    left.plot([0, 1], [0, 1], "--", color="#b0b0b0", linewidth=1)
    left.set(xlabel="False positive rate", ylabel="True positive rate", title="ROC")

    right.plot(curve_r, curve_p, color="#6d3ae0")
    right.axhline(y_true.mean(), linestyle="--", color="#b0b0b0", linewidth=1)
    right.set(xlabel="Recall", ylabel="Precision", title="Precision-Recall")

    figure.suptitle(f"{spec.display_name} - n={len(y_true)}")
    figure.tight_layout()
    figure.savefig(path, dpi=140)
    plt.close(figure)


def update_latest() -> None:
    """Roll the newest run per dataset into results/latest.json.

    The Gradio app and the frontend read only this file, so no surface can show a
    number that is not backed by a committed run.
    """
    newest: dict[str, dict] = {}
    for path in sorted(RESULTS_DIR.glob("*.json")):
        if path.name == "latest.json":
            continue
        record = json.loads(path.read_text())
        key = record["dataset_key"]
        if key not in newest or record["run_at"] > newest[key]["run_at"]:
            newest[key] = record

    (RESULTS_DIR / "latest.json").write_text(
        json.dumps({"runs": sorted(newest.values(), key=lambda r: r["dataset_key"])}, indent=2)
        + "\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", required=True, choices=sorted(SPECS))
    parser.add_argument("--per-class", type=int, default=1000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--recrop", action="store_true", help="run face detection before scoring")
    args = parser.parse_args()

    spec = SPECS[args.dataset]
    if args.recrop:
        spec = DatasetSpec(**{**asdict(spec), "pre_cropped": False})

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"=== {spec.display_name} ===")
    print(f"  repo: {spec.repo}")

    detector = DeepfakeDetector()
    print(f"  device: {detector.device}  weights: {detector.weights_sha256[:16]}...")

    cache = RESULTS_DIR.parent / ".sample-cache" / spec.key
    sample = load_balanced_sample(spec, args.per_class, args.seed, cache)
    print(f"  sampled {len(sample)} images")

    started = time.time()
    y_score, y_true, groups, skipped = score(detector, sample, spec, args.batch_size)
    elapsed = time.time() - started

    metrics = compute_metrics(y_true, y_score, detector.threshold)
    per_video = video_level(y_true, y_score, groups)

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    record = {
        "dataset_key": spec.key,
        "dataset_name": spec.display_name,
        "dataset_repo": spec.repo,
        "provenance": spec.provenance,
        "manipulation_family": spec.manipulation_family,
        "splits_note": all_splits_are_held_out(spec),
        "model_id": detector.model_id,
        "weights_sha256": detector.weights_sha256,
        "model_trained_by": "Yermakov et al., on FaceForensics++. Not trained in this repo.",
        "n_images": int(len(y_true)),
        "n_skipped_no_face": skipped,
        "face_recropped": not spec.pre_cropped,
        "seed": args.seed,
        "batch_size": args.batch_size,
        "device": str(detector.device),
        "dtype": str(detector.dtype),
        "torch_version": torch.__version__,
        "elapsed_seconds": round(elapsed, 1),
        "images_per_second": round(len(y_true) / elapsed, 2) if elapsed else None,
        "git_sha": _git_sha(),
        "run_at": stamp,
        "metrics": metrics,
        "video_level": per_video,
    }

    result_path = RESULTS_DIR / f"{spec.key}_{stamp}.json"
    result_path.write_text(json.dumps(record, indent=2) + "\n")

    predictions_path = RESULTS_DIR / f"{spec.key}_predictions.csv"
    with predictions_path.open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["index", "label", "source", "p_fake"])
        for i, (truth, group, probability) in enumerate(zip(y_true, groups, y_score, strict=True)):
            writer.writerow([i, "fake" if truth else "real", group or "", f"{probability:.6f}"])

    save_curves(y_true, y_score, spec, RESULTS_DIR / f"{spec.key}_curves.png")
    update_latest()

    print(f"\n  ROC-AUC {metrics['roc_auc']:.4f}   PR-AUC {metrics['pr_auc']:.4f}")
    print(
        f"  @0.5  P {metrics['precision_at_default']:.3f}  R {metrics['recall_at_default']:.3f}"
        f"  F1 {metrics['f1_at_default']:.3f}  acc {metrics['accuracy_at_default']:.3f}"
    )
    print(
        f"  best F1 {metrics['best_f1']:.3f} at threshold "
        f"{metrics['best_f1_threshold']:.3f}"
    )
    if per_video:
        print(
            f"  video-level ROC-AUC {per_video['roc_auc']:.4f} "
            f"over {per_video['n_videos']} videos"
        )
    print(f"\n  wrote {result_path.name}, {predictions_path.name}, {spec.key}_curves.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
