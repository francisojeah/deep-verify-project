# model-development — unrun scaffolding

**Nothing in this directory was ever trained. There are no results, no weights,
and no metrics from any of it.**

It contains exploratory training scripts written before the project changed
direction — Xception, EfficientNet, ResNet3D, CNN-LSTM and an ensemble, plus data
preparation helpers. None of them was executed to completion. No checkpoint was
produced. The `.h5` files that `app/deepfake_detector.py` used to load from
`model-development/models/` never existed, which is one of the reasons the service
could not start.

It is kept rather than deleted because it shows the direction originally intended,
and deleting it would hide part of the project's history. It is clearly separated
from the working system so that nobody mistakes it for something that ran.

The shipped detector does not use any of this code. It runs the pre-trained
[`yermandy/deepfake-detection`](https://huggingface.co/yermandy/deepfake-detection)
checkpoint — see the [root README](../README.md).

Training a competitive detector needs FaceForensics++ or Celeb-DF-v2 access, a
GPU, and days rather than hours. That is future work, not completed work.
