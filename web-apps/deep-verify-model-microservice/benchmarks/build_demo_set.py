"""Build a labelled folder of demo images from the benchmark datasets.

Images come from datasets with published ground-truth labels, so every file in
the output is known to be real or manipulated. Images scraped from the web would
carry no verifiable label, which is the opposite of what this project is for.

The output is deliberately not committed: these datasets carry research-only
licences and are not redistributed here. Regenerate with

    python -m benchmarks.build_demo_set --out ../../demo-assets
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

from benchmarks.datasets import SPECS
from benchmarks.run_benchmark import load_balanced_sample
from deepverify.detector import DeepfakeDetector
from deepverify.faces import NoFaceDetectedError


def _score_sample(detector: DeepfakeDetector, sample, spec, batch_size: int):
    """Score every image, returning (index, label, probability) triples."""
    rows = []
    for start in range(0, len(sample), batch_size):
        stop = min(start + batch_size, len(sample))
        images, kept = [], []

        for index in range(start, stop):
            image = sample.fetch(index).convert("RGB")
            if not spec.pre_cropped:
                try:
                    image = detector.crop_face(image).image
                except NoFaceDetectedError:
                    continue
            images.append(image)
            kept.append(index)

        for probability, index in zip(detector.score_faces(images), kept, strict=True):
            rows.append((index, sample.labels[index], probability))
        print(f"  scored {stop}/{len(sample)}", end="\r", flush=True)

    print()
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", default="fakeavceleb", choices=sorted(SPECS))
    parser.add_argument("--per-class", type=int, default=150, help="candidates to score")
    parser.add_argument("--keep", type=int, default=5, help="confident examples per class")
    parser.add_argument("--misses", type=int, default=3, help="instructive failures to keep")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    spec = SPECS[args.dataset]
    detector = DeepfakeDetector()
    threshold = detector.threshold

    print(f"Loading {spec.display_name}")
    cache = Path(__file__).parent / ".sample-cache" / f"demo-{spec.key}"
    sample = load_balanced_sample(spec, args.per_class, args.seed, cache)

    print(f"Scoring {len(sample)} candidates")
    rows = _score_sample(detector, sample, spec, args.batch_size)

    fake = sorted(
        (r for r in rows if r[1] == spec.fake_label), key=lambda r: r[2], reverse=True
    )
    real = sorted((r for r in rows if r[1] != spec.fake_label), key=lambda r: r[2])

    # Confident, correct examples make the demo legible; the misses keep it honest.
    selection = [("manipulated", r) for r in fake[: args.keep]]
    selection += [("authentic", r) for r in real[: args.keep]]
    selection += [
        ("missed", r) for r in reversed(fake) if r[2] < threshold
    ][: args.misses]

    manifest = []
    for folder, (index, label, probability) in selection:
        directory = args.out / folder
        directory.mkdir(parents=True, exist_ok=True)
        name = f"{spec.key}_{index:05d}_{round(probability * 100):03d}pct.png"
        sample.fetch(index).convert("RGB").save(directory / name)
        manifest.append(
            {
                "file": f"{folder}/{name}",
                "ground_truth": "manipulated" if label == spec.fake_label else "authentic",
                "model_probability": round(probability, 4),
                "model_verdict": "manipulated" if probability >= threshold else "authentic",
                "correct": (probability >= threshold) == (label == spec.fake_label),
                "source_dataset": spec.repo,
                "manipulation_family": spec.manipulation_family,
            }
        )

    args.out.mkdir(parents=True, exist_ok=True)
    with (args.out / "manifest.csv").open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(manifest[0]))
        writer.writeheader()
        writer.writerows(manifest)

    correct = sum(row["correct"] for row in manifest)
    print(f"Wrote {len(manifest)} images to {args.out} ({correct} classified correctly)")


if __name__ == "__main__":
    main()
