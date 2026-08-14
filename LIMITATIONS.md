# Limitations

Read this before trusting any output of this system.

## The model is not mine

DeepVerify runs [`yermandy/deepfake-detection`](https://huggingface.co/yermandy/deepfake-detection),
a CLIP ViT-L/14 encoder with LN-tuning, trained on FaceForensics++ by Yermakov et
al. and released under MIT. **No model is trained or fine-tuned in this
repository.** The weights are downloaded unmodified at startup and their SHA-256
is reported by `GET /health` and recorded in every benchmark run.

The AUROC figures quoted on the upstream model card (DFD 98.0%, Celeb-DF-v2
96.6%, FFIW 91.5%, DFDC 87.2%) are **their** measurements, video-level, on
datasets I do not have access to. They are not my results and are not evidence
about this deployment.

## What it cannot do

- **Images only.** No video, no audio. Video was removed from the UI rather than
  left as a control that silently fails.
- **Faces only.** With no detectable face the service returns `422`, not a score.
  A number for a face-free image would be meaningless.
- **One face per image.** Only the largest detected face is scored.
- **Single frame.** The upstream paper aggregates many frames per video. A single
  image is a strictly harder and noisier setting.

## What the measured numbers do and do not mean

All figures in the README come from `benchmarks/run_benchmark.py`, with raw
output committed under
[`web-apps/deep-verify-model-microservice/benchmarks/results/`](web-apps/deep-verify-model-microservice/benchmarks/results).
The caveats that matter:

- **Dataset provenance is unverified, and one source is mislabelled.** The Hub
  repo `thenewsupercell/with_id_celeb-df-image-dataset` is named for Celeb-DF, but
  its filenames (`00001_id00220_wavtolip.mp4`) are VoxCeleb2 speaker ids with
  Wav2Lip manipulations. That is **FakeAVCeleb**, not Celeb-DF. It is reported here
  as FakeAVCeleb. Neither mirror has been verified against its official release,
  so the labels are taken on trust.
- **Frames from one video are not independent.** A balanced sample of N frames
  drawn from far fewer source videos has an effective sample size well below N.
  Video-level AUROC, computed by grouping on the source filename, is reported
  alongside frame-level for exactly this reason, and it is the more honest number.
- **No in-distribution result was measured.** FaceForensics++ and Celeb-DF-v2 both
  require a signed request form, which could not be completed in the time
  available. Every number here is cross-dataset and cross-manipulation, which is
  the harder setting. There is no measurement of the model in the domain it was
  trained on.
- **The second benchmark's dataset cannot be identified.**
  `Hemg/deepfake-and-real-images` has no dataset card, no source attribution and
  no filenames, so unlike the first set its origin cannot be checked from the
  data. Its ROC-AUC of 0.779 is a real measurement on real images, but what
  manipulation family it represents is unknown. It is reported under its repo id
  rather than a benchmark name, and the gap between it and 0.924 should be read
  as "performance varies a lot by manipulation family", not as a precise
  characterisation of any named family.
- **Preprocessing is not identical to the paper's.** The upstream evaluation used
  DeepfakeBench's face extraction. This service uses OpenCV YuNet with a 1.3x
  square margin crop. Close in spirit, not identical, and that alone can move the
  number.
- **0.5 is an arbitrary threshold.** It is not calibrated against any operating
  point or cost model. The benchmark also reports the best-F1 threshold, which
  differs. Treat scores near the threshold as "unknown", not as a verdict.

## Where it will fail

- **Manipulation families it has not seen.** Trained on FaceForensics++ face-swap
  and reenactment artefacts. Lip-sync methods such as Wav2Lip alter only the mouth
  region and are frequently missed. Fully synthetic faces from modern diffusion
  models are a different problem again and are not covered.
- **Compression and resolution.** Heavy re-encoding, small faces, and social-media
  re-uploads all degrade the score. Not quantified here.
- **Demographic bias is untested.** Neither the upstream training data nor these
  benchmark subsets are balanced by skin tone, age, or gender, and no per-group
  metrics were computed. Do not assume uniform error rates across groups.
- **Adversarial robustness is untested.** No evaluation against an attacker who
  knows the detector. Assume it can be defeated deliberately.

## Operational

- The demo runs the model on CPU, at roughly one to two seconds per image. This
  is deliberate: the free ZeroGPU tier is far faster but its quota is a few
  minutes of GPU time per day shared across visitors, after which it refuses runs
  entirely. The Space still sleeps when idle, so the first request after a pause
  is slow.
- The NestJS API is on Render's free tier, which spins down after 15 minutes and
  cold-starts in roughly 50 seconds.
- Uploaded images are not retained after analysis.

## The honest summary

This is a working deployment of someone else's detector, measured out of
distribution, with the failure modes written down. It is a useful signal and a
demonstration of the surrounding engineering. It is **not** a reliable arbiter of
whether a given image is real, and it should never be the sole basis for a
consequential decision about a person.
