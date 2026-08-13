"""Gradio front end for the DeepVerify detection service.

Deployment adapter only. All inference lives in deepverify.detector, which the
FastAPI service in deepverify.api imports from the same module.
"""

import json
from pathlib import Path

import gradio as gr

from deepverify.detector import NoFaceDetectedError, get_detector

try:  # no-op outside ZeroGPU, but must be absent from local dev installs
    import spaces

    gpu = spaces.GPU(duration=30)
except ImportError:

    def gpu(fn):
        return fn


MODEL_URL = "https://huggingface.co/yermandy/deepfake-detection"
CODE_URL = "https://github.com/francisojeah/deep-verify-project"
RESULTS = Path(__file__).parent / "benchmarks" / "results" / "latest.json"

detector = get_detector()


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


@gpu
def analyse(image):
    if image is None:
        raise gr.Error("Upload an image first.")

    try:
        prediction = detector.predict(image)
    except NoFaceDetectedError:
        raise gr.Error(
            "No face detected. This model is trained on face crops, so a score on a "
            "face-free image would be meaningless - it returns nothing rather than guess."
        )

    scores = {
        "Manipulated": prediction.fake_probability,
        "Authentic": prediction.real_probability,
    }
    verdict = (
        f"### {'Likely manipulated' if prediction.is_deepfake else 'No manipulation detected'}\n\n"
        f"p(manipulated) = **{prediction.fake_probability:.4f}** "
        f"at a decision threshold of {prediction.threshold}.\n\n"
        f"Face found at {prediction.face_box} with detector confidence "
        f"{prediction.face_confidence:.3f}."
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
