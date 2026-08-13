"""Gradio front end for the DeepVerify detection service.

Deployment adapter only. All inference lives in deepverify.detector, which the
FastAPI service in deepverify.api imports from the same module.
"""

import json
from pathlib import Path

import gradio as gr

from deepverify.config import Settings
from deepverify.detector import DeepfakeDetector, NoFaceDetectedError

MODEL_URL = "https://huggingface.co/yermandy/deepfake-detection"
CODE_URL = "https://github.com/francisojeah/deep-verify-project"
RESULTS = Path(__file__).parent / "benchmarks" / "results" / "latest.json"

try:
    import spaces

    ON_ZERO_GPU = True
except ImportError:  # local development
    ON_ZERO_GPU = False

# ZeroGPU requires a cuda placement at module level and refuses to start without
# at least one @spaces.GPU function, so the primary detector is GPU-resident.
detector = DeepfakeDetector(Settings(device="cuda" if ON_ZERO_GPU else "auto"))

_cpu_detector: DeepfakeDetector | None = None


def _score_on_cpu(face) -> float:
    """Fallback for when the shared GPU quota is spent.

    Built lazily so the second copy of the weights only costs memory if it is
    actually needed. CLIP ViT-L/14 is about a second per image on CPU, which is
    a better demo than an error.
    """
    global _cpu_detector
    if _cpu_detector is None:
        _cpu_detector = DeepfakeDetector(Settings(device="cpu"))
    return _cpu_detector.score_faces([face])[0]


def _score_on_gpu(face) -> float:
    return detector.score_faces([face])[0]


if ON_ZERO_GPU:
    # Only the forward pass is GPU-scoped; face detection stays on CPU. Keeping
    # the window small stretches the daily quota and improves queue priority.
    _score_on_gpu = spaces.GPU(duration=15)(_score_on_gpu)


def _measured_performance() -> str:
    """Render committed benchmark results, or say there are none.

    Reads from disk on purpose: there is no code path that can print a number
    which is not backed by a committed benchmark run.
    """
    if not RESULTS.exists():
        return (
            "**Measured performance:** benchmark not yet run. No number is shown "
            "here until one is measured and committed to the repository."
        )

    data = json.loads(RESULTS.read_text())
    lines = [
        "**Measured performance** (my own runs, raw output committed to the repo):",
        "",
        "| Benchmark | Images | ROC-AUC | PR-AUC | F1 @ 0.5 |",
        "| --- | --- | --- | --- | --- |",
    ]
    for run in data["runs"]:
        m = run["metrics"]
        lines.append(
            f"| {run['dataset_name']} | {run['n_images']:,} | {m['roc_auc']:.3f} "
            f"| {m['pr_auc']:.3f} | {m['f1_at_default']:.3f} |"
        )
    return "\n".join(lines)


def analyse(image):
    if image is None:
        raise gr.Error("Upload an image first.")

    # Face detection runs here, outside any GPU window: it is cheap, and it keeps
    # the no-face case a plain exception rather than one crossing a process
    # boundary.
    try:
        face = detector.crop_face(image)
    except NoFaceDetectedError:
        raise gr.Error(
            "No face detected. This model is trained on face crops, so a score on a "
            "face-free image would be meaningless - it returns nothing rather than guess."
        )

    try:
        fake_probability = _score_on_gpu(face.image)
    except Exception:  # quota spent, queue timeout - answer anyway
        fake_probability = _score_on_cpu(face.image)

    threshold = detector.threshold
    is_deepfake = fake_probability >= threshold
    scores = {"Manipulated": fake_probability, "Authentic": 1.0 - fake_probability}
    verdict = (
        f"### {'Likely manipulated' if is_deepfake else 'No manipulation detected'}\n\n"
        f"p(manipulated) = **{fake_probability:.4f}** "
        f"at a decision threshold of {threshold}.\n\n"
        f"Face found at {face.box} with detector confidence {face.confidence:.3f}."
    )
    return scores, verdict


PROVENANCE = f"""
# DeepVerify - image deepfake detection

**I did not train this model.** It is a published pre-trained checkpoint:
[`yermandy/deepfake-detection`]({MODEL_URL}) - a CLIP ViT-L/14 visual encoder with
LN-tuning, trained on FaceForensics++ by Yermakov et al. and released under MIT.
Weights are downloaded from that repository at startup and used unmodified.

What I built is the service around it: face detection and cropping, the inference
pipeline, a FastAPI service, this deployment, and the benchmark below.
[Source code]({CODE_URL})
"""

LIMITATIONS = """
- **Images only.** No video or audio support.
- **Faces only.** Without a detected face the service returns an error, not a score.
- **Frame-level.** The published paper reports video-level AUROC by aggregating
  many frames; a single image is a strictly harder and noisier setting.
- **Cross-manipulation generalisation is weak.** The model was trained on
  FaceForensics++ face-swap and reenactment artefacts. Lip-sync manipulations such
  as Wav2Lip are a different family and are frequently missed - the measured
  numbers below show this rather than hide it.
- **0.5 is an arbitrary threshold**, not a calibrated operating point.
- Compression, resolution and unusual lighting all degrade the score.
- Treat the output as one signal, never as proof.
"""

with gr.Blocks(title="DeepVerify") as demo:
    gr.Markdown(PROVENANCE)

    with gr.Row():
        with gr.Column():
            image_input = gr.Image(type="pil", label="Image containing a face", height=340)
            submit = gr.Button("Analyse", variant="primary")
            gr.Examples(
                examples=[
                    ["tests/fixtures/real.png"],
                    ["tests/fixtures/fake_wav2lip.png"],
                ],
                inputs=image_input,
            )
        with gr.Column():
            label_output = gr.Label(num_top_classes=2, label="Model output")
            verdict_output = gr.Markdown()

    gr.Markdown(_measured_performance())

    with gr.Accordion("Limitations - read before trusting any of this", open=False):
        gr.Markdown(LIMITATIONS)

    submit.click(
        analyse,
        inputs=image_input,
        outputs=[label_output, verdict_output],
        api_name="detect",
    )

if __name__ == "__main__":
    demo.launch()
