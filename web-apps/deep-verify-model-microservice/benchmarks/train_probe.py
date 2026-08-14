"""Train a linear probe on frozen CLIP features, and compare it fairly.

Motivated by a measurement already in this repository: the published checkpoint
reaches 0.92 ROC-AUC on lip-sync and face-swap manipulations and 0.78 on an
unfamiliar family. This asks whether that gap is a feature problem or a head
problem, by freezing CLIP ViT-L/14 and fitting logistic regression on top.

The pre-trained detector is scored on the *same held-out split*, so the two
numbers are comparable. Comparing a probe's test score against a full-set score
measured elsewhere would flatter the probe.

    python -m benchmarks.train_probe --dataset hemg-mixed --per-class 1000
"""

from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

from benchmarks.datasets import SPECS, DatasetSpec
from benchmarks.run_benchmark import Sample, compute_metrics, load_balanced_sample
from deepverify.config import get_settings
from deepverify.detector import DeepfakeDetector, resolve_device

RESULTS_DIR = Path(__file__).parent / "results" / "probe"


def _git_sha() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], text=True, stderr=subprocess.DEVNULL
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


class ClipFeatures:
    """Frozen CLIP ViT-L/14 image embeddings.

    The same encoder the detector is built on, but untouched: no LN-tuning, no
    classification head. Only the probe on top of it is trained here.
    """

    def __init__(self, repo: str, device: torch.device):
        from transformers import CLIPImageProcessor, CLIPVisionModelWithProjection

        self.device = device
        self.processor = CLIPImageProcessor.from_pretrained(repo)
        self.model = CLIPVisionModelWithProjection.from_pretrained(repo)
        self.model.eval().to(device)

    @torch.inference_mode()
    def embed(self, images: list) -> np.ndarray:
        pixels = self.processor(images=images, return_tensors="pt")["pixel_values"]
        embeds = self.model(pixel_values=pixels.to(self.device)).image_embeds
        # L2 normalise: CLIP embeddings are used as directions, and it keeps the
        # regularisation strength meaningful across batches.
        embeds = embeds / embeds.norm(dim=-1, keepdim=True)
        return embeds.float().cpu().numpy()


def _batched(sample: Sample, spec: DatasetSpec, indices: list[int], size: int):
    for start in range(0, len(indices), size):
        chunk = indices[start : start + size]
        yield chunk, [sample.fetch(i).convert("RGB") for i in chunk]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", default="hemg-mixed", choices=sorted(SPECS))
    parser.add_argument("--per-class", type=int, default=1000)
    parser.add_argument("--test-size", type=float, default=0.3)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()

    spec = SPECS[args.dataset]
    settings = get_settings()
    device = resolve_device(settings.device)

    print(f"Loading {spec.display_name}")
    cache = Path(__file__).parent / ".sample-cache" / f"probe-{spec.key}"
    sample = load_balanced_sample(spec, args.per_class, args.seed, cache)
    y = np.array([1 if name == spec.fake_label else 0 for name in sample.labels])

    train_idx, test_idx = train_test_split(
        np.arange(len(sample)), test_size=args.test_size, random_state=args.seed, stratify=y
    )
    train_idx, test_idx = sorted(train_idx.tolist()), sorted(test_idx.tolist())
    print(f"  {len(train_idx)} train, {len(test_idx)} test")

    print("Extracting frozen CLIP features")
    encoder = ClipFeatures(settings.processor_repo, device)
    features: dict[int, np.ndarray] = {}
    done = 0
    for chunk, images in _batched(sample, spec, train_idx + test_idx, args.batch_size):
        for index, vector in zip(chunk, encoder.embed(images), strict=True):
            features[index] = vector
        done += len(chunk)
        print(f"  {done}/{len(sample)}", end="\r", flush=True)
    print()

    x_train = np.stack([features[i] for i in train_idx])
    x_test = np.stack([features[i] for i in test_idx])
    y_train, y_test = y[train_idx], y[test_idx]

    print("Fitting logistic regression")
    probe = LogisticRegression(max_iter=2000, C=1.0, random_state=args.seed)
    probe.fit(x_train, y_train)
    probe_scores = probe.predict_proba(x_test)[:, 1]

    print("Scoring the pre-trained detector on the same test split")
    detector = DeepfakeDetector()
    baseline_scores = []
    for chunk, images in _batched(sample, spec, test_idx, args.batch_size):
        baseline_scores.extend(detector.score_faces(images))
    baseline_scores = np.array(baseline_scores)

    threshold = detector.threshold
    record = {
        "run_at": datetime.now(timezone.utc).isoformat(),
        "git_sha": _git_sha(),
        "dataset_key": spec.key,
        "dataset_name": spec.display_name,
        "dataset_repo": spec.repo,
        "provenance": spec.provenance,
        "manipulation_family": spec.manipulation_family,
        "seed": args.seed,
        "device": str(device),
        "n_train": len(train_idx),
        "n_test": len(test_idx),
        "split": "stratified, disjoint, seeded; identical for both models",
        "models": {
            "probe": {
                "description": (
                    "Logistic regression on frozen CLIP ViT-L/14 image embeddings "
                    "(openai/clip-vit-large-patch14). Trained here."
                ),
                "trained_here": True,
                "metrics": compute_metrics(y_test, probe_scores, threshold),
            },
            "pretrained": {
                "description": (
                    "yermandy/deepfake-detection, the published checkpoint. "
                    "Not trained here."
                ),
                "trained_here": False,
                "weights_sha256": detector.weights_sha256,
                "metrics": compute_metrics(y_test, baseline_scores, threshold),
            },
        },
    }

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    stamp = record["run_at"].replace("-", "").replace(":", "").split(".")[0] + "Z"
    path = RESULTS_DIR / f"{spec.key}_probe_{stamp}.json"
    path.write_text(json.dumps(record, indent=2) + "\n")

    probe_auc = record["models"]["probe"]["metrics"]["roc_auc"]
    base_auc = record["models"]["pretrained"]["metrics"]["roc_auc"]
    print()
    print(f"  probe      ROC-AUC {probe_auc:.4f}")
    print(f"  pretrained ROC-AUC {base_auc:.4f}")
    print(f"  difference {probe_auc - base_auc:+.4f}")
    print(f"Wrote {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
