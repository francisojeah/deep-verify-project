"""Hugging Face Space entry point.

One deployment, two interfaces: the REST API from deepverify.api for machines,
and a Gradio UI for people. Both call the same detector instance, so the demo
and the API cannot disagree.

Inference itself lives in deepverify.detector. Nothing is trained here.
"""

import json
import os
from pathlib import Path

# Must precede any deepverify import: settings are cached on first read, and on
# ZeroGPU the model has to be built on cuda.
ON_ZERO_GPU = os.environ.get("SPACES_ZERO_GPU", "").lower() in {"1", "true"}
if ON_ZERO_GPU:
    os.environ.setdefault("DEEPVERIFY_DEVICE", "cuda")

import gradio as gr  # noqa: E402
import uvicorn  # noqa: E402
from PIL import Image  # noqa: E402

from deepverify import api  # noqa: E402
from deepverify.config import Settings  # noqa: E402
from deepverify.detector import (  # noqa: E402
    DeepfakeDetector,
    NoFaceDetectedError,
    Prediction,
    get_detector,
)

if ON_ZERO_GPU:
    # Must precede any cuda placement. ZeroGPU has no GPU attached at import
    # time, and this is what defers CUDA init until inside a @spaces.GPU call;
    # without it, building the detector raises "No CUDA GPUs are available".
    import spaces

MODEL_URL = "https://huggingface.co/yermandy/deepfake-detection"
CODE_URL = "https://github.com/francisojeah/deep-verify-project"
RESULTS = Path(__file__).parent / "benchmarks" / "results" / "latest.json"

detector = get_detector()

_cpu_detector: DeepfakeDetector | None = None


def _score(face: Image.Image) -> float:
    return detector.score_faces([face])[0]


if ON_ZERO_GPU:
    # Only the forward pass is GPU-scoped; face detection stays on CPU. Keeping
    # the window small stretches the shared daily quota.
    _score = spaces.GPU(duration=15)(_score)

    def _score_on_cpu(face: Image.Image) -> float:
        """Fallback for when the shared GPU quota is spent.

        Built lazily so a second copy of the weights only costs memory if it is
        actually needed. A slower answer beats an error.
        """
        global _cpu_detector
        if _cpu_detector is None:
            _cpu_detector = DeepfakeDetector(Settings(device="cpu"))
        return _cpu_detector.score_faces([face])[0]


def score_face(face: Image.Image) -> float:
    if not ON_ZERO_GPU:
        return _score(face)
    try:
        return _score(face)
    except Exception:  # quota spent or queue timeout - answer anyway
        return _score_on_cpu(face)


def predict(image: Image.Image) -> Prediction:
    """Crop on CPU, score inside the GPU window. Raises NoFaceDetectedError."""
    face = detector.crop_face(image)
    fake = score_face(face.image)
    return Prediction(
        fake_probability=fake,
        real_probability=1.0 - fake,
        threshold=detector.threshold,
        face_box=face.box,
        face_confidence=face.confidence,
    )


# The REST route calls this; see deepverify.api.run_prediction.
api.run_prediction = predict


def _measured_performance() -> str:
    """Render committed benchmark results, or say there are none.

    Reads from disk on purpose: there is no code path that can print a number
    which is not backed by a committed benchmark run.
    """
    if not RESULTS.exists():
        return "No benchmark has been run, so no performance figure is shown."

    data = json.loads(RESULTS.read_text())
    lines = [
        "| Benchmark | Images | ROC-AUC | PR-AUC | F1 @ 0.5 |",
        "| --- | --- | --- | --- | --- |",
    ]
    for run in data["runs"]:
        m = run["metrics"]
        lines.append(
            f"| {run['dataset_name']} | {run['n_images']:,} | "
            f"{m['roc_auc'] * 100:.1f}% | {m['pr_auc'] * 100:.1f}% | "
            f"{m['f1_at_default'] * 100:.1f}% |"
        )
    lines.append("")
    lines.append(
        f"Measured by [`benchmarks/run_benchmark.py`]({CODE_URL}), raw output committed "
        "to the repository. The spread between the two rows is the point: detector "
        "performance is a property of the manipulation family as much as of the model."
    )
    return "\n".join(lines)


def analyse(image):
    if image is None:
        raise gr.Error("Upload an image first.")

    try:
        prediction = predict(image)
    except NoFaceDetectedError:
        raise gr.Error(
            "No face detected. This model scores face crops, so a score here would "
            "be meaningless - it returns nothing rather than guess."
        )

    fake = prediction.fake_probability
    scores = {"Manipulated": fake, "Authentic": prediction.real_probability}
    verdict = (
        f"### {'Likely manipulated' if prediction.is_deepfake else 'No manipulation detected'}\n\n"
        f"**{fake * 100:.1f}%** likelihood of manipulation, at a decision threshold of "
        f"{prediction.threshold * 100:.0f}%.\n\n"
        f"Face located at {prediction.face_box}, detector confidence "
        f"{prediction.face_confidence * 100:.1f}%."
    )
    details = {
        "fake_probability": fake,
        "real_probability": prediction.real_probability,
        "threshold": prediction.threshold,
        "is_deepfake": prediction.is_deepfake,
        "face_box": list(prediction.face_box),
        "face_confidence": prediction.face_confidence,
        "model_id": detector.model_id,
    }
    return scores, verdict, details


INTRO = """
# DeepVerify

Upload a photo containing a face. The detector returns the likelihood that the
face was digitally manipulated.
"""

ABOUT = f"""
**Model** — [`yermandy/deepfake-detection`]({MODEL_URL}): a CLIP ViT-L/14 visual encoder
with LN-tuning, trained on FaceForensics++ by Yermakov et al. and released under MIT.
This project runs those published weights unmodified; it does not train them. What it
adds is the face detection and cropping, the inference pipeline, the API, the
benchmarks below, and this deployment. [Source]({CODE_URL})

**API** — the same detector is available over HTTP: `POST /v1/detect` with an image,
`GET /health` for the model id and weights checksum. See `/docs`.

**Scope** — Images only, one face per image, single frame. Without a detectable face
the service returns an error rather than a score.

**Reading the number** — The threshold is 50% and is not calibrated against any cost
model, so treat scores near it as uncertain. The model was trained on face-swap and
reenactment artefacts; lip-sync manipulations and fully synthetic faces are different
families and are missed more often. Compression, low resolution and unusual lighting
all degrade it. One signal, never proof.
"""

with gr.Blocks(title="DeepVerify", theme=gr.themes.Soft()) as demo:
    gr.Markdown(INTRO)

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
            details_output = gr.JSON(label="Response", visible=False)

    with gr.Accordion("Measured performance", open=False):
        gr.Markdown(_measured_performance())

    with gr.Accordion("Model, scope and limitations", open=False):
        gr.Markdown(ABOUT)

    submit.click(
        analyse,
        inputs=image_input,
        outputs=[label_output, verdict_output, details_output],
        api_name="detect",
    )

# Gradio at the root, the REST API on its own paths, one process.
app = gr.mount_gradio_app(api.app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 7860)))
