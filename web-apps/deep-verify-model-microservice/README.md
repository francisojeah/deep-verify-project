---
title: DeepVerify
emoji: 🔍
colorFrom: purple
colorTo: gray
sdk: gradio
sdk_version: 6.24.0
python_version: "3.12"
app_file: app.py
pinned: false
license: mit
models:
  - yermandy/deepfake-detection
short_description: Deepfake detection with a pre-trained CLIP ViT-L/14 model
---

# DeepVerify detection service

Image deepfake detection over a **published pre-trained checkpoint**. Upload an
image containing a face, get a calibrated-ish probability that the face was
manipulated.

## The model is not mine

**I did not train this model.** It is
[`yermandy/deepfake-detection`](https://huggingface.co/yermandy/deepfake-detection):
a CLIP ViT-L/14 visual encoder with LN-tuning (parameter-efficient fine-tuning),
trained on FaceForensics++ by Yermakov et al. and released under MIT. The weights
are downloaded from that repository at startup and used unmodified. No training or
fine-tuning happens in this repository.

What is mine is the service around it: face detection and cropping, the inference
pipeline, the FastAPI service, the deployment, and the benchmark.

The upstream authors report these **video-level** AUROC figures:

| Dataset     | AUROC |
| ----------- | ----- |
| DFD         | 98.0% |
| Celeb-DF-v2 | 96.6% |
| FFIW        | 91.5% |
| DFDC        | 87.2% |

Those are their numbers, not mine, and they are measured video-level by aggregating
many frames. My own single-image measurements are in
[`benchmarks/results/`](benchmarks/results) - see the root
[README](../../README.md) and [LIMITATIONS.md](../../LIMITATIONS.md).

## How it works

```
image -> YuNet face detection -> square margin crop -> CLIP preprocessing (224px)
      -> CLIP ViT-L/14 + LN-tuning head -> softmax -> p(manipulated)
```

If no face is detected the service returns **422, not a score**. The model is
trained on face crops, so a number for a face-free image would be meaningless.

`deepverify/detector.py` is the single inference implementation. Both the FastAPI
service (`deepverify/api.py`) and the Gradio Space (`app.py`) import it, so the
demo and the API cannot drift apart.

## Running locally

```bash
python3.11 -m venv .venv && ./.venv/bin/pip install -r requirements.txt

# FastAPI service
./.venv/bin/uvicorn deepverify.api:app --reload
curl -F file=@tests/fixtures/real.png http://localhost:8000/v1/detect

# Gradio UI
./.venv/bin/python app.py

# Tests
PYTHONPATH=. ./.venv/bin/pytest tests/ -q
```

Docker:

```bash
docker build -t deepverify . && docker run -p 8000:8000 deepverify
```

## API

| Method | Path         | Purpose                                              |
| ------ | ------------ | ---------------------------------------------------- |
| `GET`  | `/health`    | status, model id, weights SHA-256, device, threshold |
| `POST` | `/v1/detect` | multipart `file` -> detection result                 |

`POST /v1/detect` returns:

```json
{
  "is_deepfake": false,
  "label": "real",
  "fake_probability": 0.096,
  "real_probability": 0.904,
  "threshold": 0.5,
  "face_box": [51, 2, 182, 166],
  "face_confidence": 0.949,
  "model_id": "yermandy/deepfake-detection/model.torchscript"
}
```

Errors: `400` unreadable image, `413` over the size limit, `422` no face detected.

## Configuration

Environment variables, all prefixed `DEEPVERIFY_`:

| Variable                          | Default    | Purpose                                         |
| --------------------------------- | ---------- | ----------------------------------------------- |
| `DEEPVERIFY_DEVICE`               | `auto`     | `auto` resolves cuda, then mps, then cpu        |
| `DEEPVERIFY_DECISION_THRESHOLD`   | `0.5`      | uncalibrated; see limitations                   |
| `DEEPVERIFY_FACE_MARGIN`          | `1.3`      | crop side as a multiple of the longest box edge |
| `DEEPVERIFY_FACE_SCORE_THRESHOLD` | `0.6`      | YuNet minimum confidence                        |
| `DEEPVERIFY_MAX_UPLOAD_BYTES`     | `10485760` | 10 MB                                           |
| `DEEPVERIFY_ALLOWED_ORIGINS`      | `*`        | comma-separated CORS origins                    |

## Notes on two engineering choices

**YuNet over MTCNN.** `facenet-pytorch` pins `torch<2.3`, which cannot coexist with
the `torch>=2.8` that ZeroGPU requires. OpenCV's YuNet has no torch dependency, ships
as a 232 KB ONNX file, and detects reliably at this resolution.

**bfloat16 is forced, not chosen.** The exported TorchScript graph casts activations
to bfloat16 internally, so float32 weights raise a dtype mismatch inside the trace.
The archive also contains a float64 tensor, so it must be loaded on CPU and cast
before moving to MPS, which rejects float64.
