# DeepVerify

Image deepfake detection: upload a photo containing a face, get a probability
that the face was manipulated, with the model's provenance and measured
performance shown next to the result.

|                      |                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Live demo**        | https://huggingface.co/spaces/francisojeah/deep-verify                                    |
| **Model**            | [`yermandy/deepfake-detection`](https://huggingface.co/yermandy/deepfake-detection) (MIT) |
| **Measured results** | [`benchmarks/results/`](web-apps/deep-verify-model-microservice/benchmarks/results)       |
| **Limitations**      | [LIMITATIONS.md](LIMITATIONS.md)                                                          |

## I did not train this model

DeepVerify runs a **published pre-trained checkpoint**: a CLIP ViT-L/14 visual
encoder with LN-tuning, trained on FaceForensics++ by Yermakov et al. and
released under MIT. The weights are downloaded from that repository at startup
and used unmodified. No training or fine-tuning happens here.

What this repository contains is the engineering around it: face detection and
cropping, the inference pipeline, a FastAPI service, an API layer with accounts
and history, a React client, the deployment, and the benchmark below.

The upstream authors report video-level AUROC of 98.0% on DFD, 96.6% on
Celeb-DF-v2, 91.5% on FFIW and 87.2% on DFDC. **Those are their numbers, not
mine.** Mine are below.

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

Reproduce:

```bash
cd web-apps/deep-verify-model-microservice
PYTHONPATH=. ./.venv/bin/python -m benchmarks.run_benchmark \
  --dataset fakeavceleb --per-class 1200 --seed 42
```

## Architecture

```
React + Vite ──┬────────────────────────────► Hugging Face Space (CPU)
  (Vercel)     │                                 Gradio adapter
               │                                 └─ deepverify.detector
               └──► NestJS API ──────────────────────────┘
                     (Render)        detection, history, accounts
                        │
                    MongoDB Atlas
```

Three services because the ML runtime and the CRUD runtime have genuinely
different shapes: one holds a 607 MB model in memory and scales on inference
capacity, the other holds a database pool and scales on concurrent connections.
Coupled, every auth change would redeploy the model.

The honest caveat: **at this scale a single FastAPI service with SQLite would be
simpler.** The split earns its keep once there are real users and a GPU bill.

`deepverify/detector.py` is the only inference implementation. Both the FastAPI
service and the Gradio Space import it, so the demo and the API cannot drift.

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

| Service   | Host               | Notes                                                |
| --------- | ------------------ | ---------------------------------------------------- |
| Detection | Hugging Face Space | Runs on CPU, ~1-2 s per image. Sleeps when idle.     |
| API       | Render             | Free tier spins down after 15 min; ~50 s cold start. |
| Client    | Vercel             | Root directory `web-apps/deep-verify-frontend`.      |
| Database  | MongoDB Atlas M0   | Free tier.                                           |

Render's free tier has 512 MB of RAM, which cannot hold a 607 MB model, so the
detector is not deployed there. A Hugging Face Space puts the demo on the same
page as the model card, which is the right place for it when the whole point is
that the weights are someone else's.

The Space runs the model on **CPU on purpose**. ZeroGPU is free and much faster,
but its quota is a few minutes of GPU time per day shared across visitors, and it
starts refusing runs once that is spent. CLIP ViT-L/14 costs about a second per
image on CPU, so the trade is a second of latency for a demo that always answers.

## What I would do next

1. **Get official FaceForensics++ and Celeb-DF-v2 access** and measure
   in-distribution, so the generalisation gap can be quantified rather than
   asserted.
2. **Calibrate the threshold** against a cost model instead of leaving it at 0.5.
3. **Video support** by sampling frames and aggregating, which is how the upstream
   paper reports its numbers and would close the gap with them.
4. **Evaluate on [Deepfake-Eval-2024](https://huggingface.co/datasets/nuriachandra/Deepfake-Eval-2024)**,
   an in-the-wild benchmark of deepfakes actually circulated in 2024. It is
   access-gated, so it needs a request rather than an afternoon.
5. **Per-group error rates.** No demographic breakdown was computed, so uniform
   accuracy across groups cannot be assumed.

## Licence

MIT. The model weights are MIT, by their authors. Benchmark datasets carry their
own licences and are not redistributed here.
