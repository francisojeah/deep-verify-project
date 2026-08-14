# DeepVerify

Image deepfake detection: upload a photo containing a face, get the likelihood
that the face was manipulated, with the model's provenance and measured
performance shown next to the result.

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Live site**         | https://francisojeah.github.io/deep-verify-project/                                       |
| **Detection service** | https://huggingface.co/spaces/francisojeah/deep-verify                                    |
| **Model**             | [`yermandy/deepfake-detection`](https://huggingface.co/yermandy/deepfake-detection) (MIT) |
| **Measured results**  | [`benchmarks/results/`](web-apps/deep-verify-model-microservice/benchmarks/results)       |
| **Limitations**       | [LIMITATIONS.md](LIMITATIONS.md)                                                          |

## The model

DeepVerify runs a published pre-trained checkpoint: a CLIP ViT-L/14 visual
encoder with LN-tuning, trained on FaceForensics++ by Yermakov et al. and
released under MIT. The weights are downloaded from that repository at startup
and used unmodified — nothing is trained or fine-tuned here.

What this repository contains is the engineering around them: face detection and
cropping, the inference pipeline, a FastAPI service, an API layer with accounts
and history, a React client, the deployment, and the benchmarks below.

The upstream authors report video-level AUROC of 98.0% on DFD, 96.6% on
Celeb-DF-v2, 91.5% on FFIW and 87.2% on DFDC. Those are their measurements on
data this project has no access to. The measurements below are its own.

## Measured performance

Everything here comes from `benchmarks/run_benchmark.py`, run locally, with the
raw output committed. Nothing is estimated.

**FakeAVCeleb, 2,210 images (1,105 per class), seed 42**

| Metric                  | Value                               |
| ----------------------- | ----------------------------------- |
| ROC-AUC                 | **0.9244**                          |
| PR-AUC                  | 0.9420                              |
| Precision @ 0.5         | 0.950                               |
| Recall @ 0.5            | 0.750                               |
| F1 @ 0.5                | 0.838                               |
| Best F1                 | 0.867 at threshold 0.271            |
| **Video-level ROC-AUC** | **0.9209** over 1,252 source videos |

Confusion matrix at 0.5: TN 1061, FP 44, FN 276, TP 829. The model is
conservative — it rarely calls an authentic face manipulated (44 false positives)
but misses a quarter of the manipulations at the default threshold.

Three things to know about that number:

1. **It is cross-dataset and cross-manipulation.** The model was trained on
   FaceForensics++ face-swap and reenactment. FakeAVCeleb is mostly Wav2Lip
   lip-sync on VoxCeleb2 sources — a family it has never seen. This is the hard
   setting, not the flattering one.
2. **No in-distribution number was measured.** FaceForensics++ and Celeb-DF-v2
   both require a signed access form that could not be completed in time. That is
   a real gap, stated rather than hidden.
3. **The dataset's Hub listing is wrong, and it matters.**
   `thenewsupercell/with_id_celeb-df-image-dataset` is published as Celeb-DF, but
   its filenames (`00001_id00220_wavtolip.mp4`) are VoxCeleb2 speaker ids with
   Wav2Lip manipulations. That is FakeAVCeleb. Reporting it as Celeb-DF would have
   produced a number that looked comparable to the paper's 96.6% and was not.

Video-level AUC is reported alongside frame-level because frames from one source
video are not independent, so the effective sample size is well below 2,210.

### Performance is not one number

A second run, same model, same code, same seed, on a different set of
manipulations:

| Benchmark                                 | Images |    ROC-AUC | PR-AUC | F1 @ 0.5 |
| ----------------------------------------- | -----: | ---------: | -----: | -------: |
| FakeAVCeleb — lip-sync + face-swap        |  2,210 | **0.9244** | 0.9420 |    0.838 |
| `Hemg/deepfake-and-real-images` — unknown |  2,000 | **0.7794** | 0.7928 |    0.596 |

**A 0.145 AUC drop from changing nothing but the manipulations.** Recall at the
default threshold falls from 0.750 to 0.457 — it misses more than half. This is
the point worth taking away: a single headline accuracy figure for a deepfake
detector is close to meaningless, because the number is a property of the test
set as much as of the model. It is why the threshold-free AUC is quoted first and
why both runs are published rather than the better one.

The honest caveat on the second row: that dataset has no card, no attribution and
no filenames, so unlike the first it **cannot be identified from its contents**.
The measurement is real; the label on it is not verifiable. It is reported under
its repo id for that reason.

Reproduce:

```bash
cd web-apps/deep-verify-model-microservice
PYTHONPATH=. ./.venv/bin/python -m benchmarks.run_benchmark \
  --dataset fakeavceleb --per-class 1200 --seed 42

PYTHONPATH=. ./.venv/bin/python -m benchmarks.run_benchmark \
  --dataset hemg-mixed --per-class 1000 --seed 42
```

## Architecture

```
React + Vite ──┬──────────────────────────►  Hugging Face Space
(GitHub Pages) │                             ├─ /            Gradio UI
               │                             ├─ /v1/detect   REST
               │                             └─ deepverify.detector
               └──► NestJS API ──────────────────────┘
                     (Render)      accounts, history
                        │
                    MongoDB Atlas
```

Two services because the ML runtime and the CRUD runtime have genuinely
different shapes: one holds a 607 MB model in memory and scales on inference
capacity, the other holds a database pool and scales on concurrent connections.
Coupled, every auth change would redeploy the model.

The honest caveat: **at this scale a single FastAPI service with SQLite would be
simpler.** The split earns its keep once there are real users and a GPU bill.

The Space runs one process serving two interfaces — Gradio for people, FastAPI
for machines — over a single detector instance, so the demo and the API cannot
disagree about a score:

```python
app = gr.mount_gradio_app(api.app, demo, path="/")
```

`deepverify/detector.py` is the only inference implementation. On ZeroGPU the
forward pass has to run inside a GPU-scoped function, so `api.run_prediction` is
a seam the Space replaces — the route itself is identical in both deployments.

| Endpoint          |                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `POST /v1/detect` | multipart image in, typed JSON out; `422` when no face is found, `413` over the size limit |
| `GET /health`     | model id, weights SHA-256, resolved device, decision threshold                             |
| `GET /docs`       | generated OpenAPI                                                                          |

## Repository layout

```
web-apps/
  deep-verify-model-microservice/   FastAPI + Gradio, the detector and benchmarks
  deep-verify-backend/              NestJS: accounts, detection history
  deep-verify-frontend/             React + TypeScript + Vite
model-development/                  unrun training scaffolding - see its README
scripts/sync-benchmarks.mjs         regenerates the UI's metrics from committed runs
```

## Running locally

```bash
# Detection service
cd web-apps/deep-verify-model-microservice
python3.11 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
./.venv/bin/uvicorn deepverify.api:app --reload      # http://localhost:8000
PYTHONPATH=. ./.venv/bin/pytest tests/ -q

# API layer  (needs DB_URI and ML_SERVICE_URL, see .env.example)
cd web-apps/deep-verify-backend && npm install && npm run dev

# Client  (needs VITE_ML_SERVICE_URL, see .env.example)
cd web-apps/deep-verify-frontend && npm install && npm run dev
```

## Deployment

| Service   | Host               | Notes                                                     |
| --------- | ------------------ | --------------------------------------------------------- |
| Client    | GitHub Pages       | `./scripts/deploy-frontend.sh`, published from `gh-pages` |
| Detection | Hugging Face Space | `./scripts/deploy-space.sh`. Sleeps when idle.            |
| API       | Render             | Not deployed. Free tier spins down after 15 min.          |
| Database  | MongoDB Atlas M0   | Not deployed.                                             |

Render's free tier has 512 MB of RAM, which cannot hold a 607 MB model, so the
detector is not deployed there. A Hugging Face Space puts the service on the same
page as the model card it runs, which is the right place for it.

The Space runs on ZeroGPU, whose quota is a few minutes of GPU time per day
shared across all visitors. Rather than surface a quota error, the app falls back
to scoring on CPU — about a second per image instead of a fraction of one. A spent
quota costs latency, not an answer.

Detection works without the API layer: the client calls the Space directly, and
accounts and history are the only features that need NestJS. That is why the
public `/analyze` page works while the API is undeployed.

## What I would do next

1. **Specialise to political media**, which is what the project set out to do and
   has not done. The detector is general face-manipulation detection; calling it
   political would be a claim about data it has never been tested on. Doing it
   honestly is a curation and access problem — assembling political deepfakes that
   actually circulated, with defensible labels — not a modelling one.
2. **Get official FaceForensics++ and Celeb-DF-v2 access** and measure
   in-distribution. The spread between manipulation families is measured; what is
   still missing is the anchor — how the model does on the data it was trained on.
3. **Calibrate the threshold** against a cost model instead of leaving it at 0.5.
4. **Video support** by sampling frames and aggregating, which is how the upstream
   paper reports its numbers and would close the gap with them.
5. **Evaluate on [Deepfake-Eval-2024](https://huggingface.co/datasets/nuriachandra/Deepfake-Eval-2024)**,
   an in-the-wild benchmark of deepfakes actually circulated in 2024. It is
   access-gated, so it needs a request rather than an afternoon.
6. **Per-group error rates.** No demographic breakdown was computed, so uniform
   accuracy across groups cannot be assumed.

## Licence

MIT. The model weights are MIT, by their authors. Benchmark datasets carry their
own licences and are not redistributed here.
