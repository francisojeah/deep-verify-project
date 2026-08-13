from __future__ import annotations

import hashlib
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import torch
from huggingface_hub import hf_hub_download
from PIL import Image
from transformers import CLIPImageProcessor

from .config import Settings, get_settings
from .faces import BoundingBox, Face, FaceCropper, NoFaceDetectedError

__all__ = ["DeepfakeDetector", "Prediction", "NoFaceDetectedError", "get_detector"]


@dataclass(frozen=True)
class Prediction:
    fake_probability: float
    real_probability: float
    threshold: float
    face_box: BoundingBox | None = None
    face_confidence: float | None = None

    @property
    def is_deepfake(self) -> bool:
        return self.fake_probability >= self.threshold

    @property
    def label(self) -> str:
        return "fake" if self.is_deepfake else "real"


def resolve_device(preference: str) -> torch.device:
    if preference != "auto":
        return torch.device(preference)
    if torch.cuda.is_available():
        return torch.device("cuda")
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


class DeepfakeDetector:
    """Wraps the pre-trained yermandy/deepfake-detection checkpoint.

    Weights are published by Yermakov et al. under MIT and trained by them on
    FaceForensics++. Nothing here is trained or fine-tuned locally.
    """

    def __init__(self, settings: Settings | None = None):
        self._settings = settings or get_settings()
        self.device = resolve_device(self._settings.device)
        # Not a preference: the exported graph casts activations to bfloat16
        # internally, so float32 weights raise a dtype mismatch inside the trace.
        self.dtype = torch.bfloat16

        weights = Path(
            hf_hub_download(self._settings.weights_repo, self._settings.weights_file)
        )
        self.weights_sha256 = _sha256(weights)

        # Load on CPU first: the archive holds a float64 tensor and MPS refuses
        # float64, so the cast has to happen before the device move.
        self._model = torch.jit.load(weights, map_location="cpu")
        self._model.eval()
        self._model = self._model.to(self.dtype).to(self.device)

        self._processor = CLIPImageProcessor.from_pretrained(self._settings.processor_repo)
        self._cropper = FaceCropper(
            margin=self._settings.face_margin,
            score_threshold=self._settings.face_score_threshold,
        )

    @property
    def model_id(self) -> str:
        return f"{self._settings.weights_repo}/{self._settings.weights_file}"

    @property
    def threshold(self) -> float:
        return self._settings.decision_threshold

    def score_faces(self, faces: list[Image.Image]) -> list[float]:
        """Fake probability for images that are already face crops.

        Bypasses detection. Used by the benchmark on pre-cropped datasets, and
        wherever the caller owns cropping.
        """
        if not faces:
            return []

        pixels = self._processor(images=faces, return_tensors="pt")["pixel_values"]
        pixels = pixels.to(self.device).to(self.dtype)

        with torch.inference_mode():
            logits = self._model(pixels)

        # Column 1 is p(fake); see upstream inference_torchscript.py.
        return logits.float().softmax(dim=1)[:, 1].cpu().tolist()

    def crop_face(self, image: Image.Image) -> Face:
        """Largest detected face. Raises NoFaceDetectedError if absent."""
        return self._cropper.largest_face(image)

    def predict(self, image: Image.Image) -> Prediction:
        """Detect the largest face, crop it, and score it.

        Raises NoFaceDetectedError when the image has no face.
        """
        face = self._cropper.largest_face(image)
        fake = self.score_faces([face.image])[0]
        return Prediction(
            fake_probability=fake,
            real_probability=1.0 - fake,
            threshold=self.threshold,
            face_box=face.box,
            face_confidence=face.confidence,
        )


@lru_cache(maxsize=1)
def get_detector() -> DeepfakeDetector:
    return DeepfakeDetector()
