from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

BoundingBox = tuple[int, int, int, int]

MODEL_PATH = Path(__file__).parent / "assets" / "face_detection_yunet_2023mar.onnx"


class NoFaceDetectedError(Exception):
    """Raised when an image contains no detectable face.

    The detector is trained on face crops, so scoring a face-free image would
    produce a number with no meaning. Callers must surface this, not a score.
    """


@dataclass(frozen=True)
class Face:
    image: Image.Image
    box: BoundingBox
    confidence: float


class FaceCropper:
    """YuNet face detection followed by a square margin crop.

    Approximates the DeepfakeBench preprocessing the upstream model was
    evaluated with: expand the detected box to a square, scale it by a margin,
    then crop. Exact parity is not claimed - see LIMITATIONS.md.

    YuNet is used rather than MTCNN because facenet-pytorch pins torch<2.3,
    which cannot coexist with the torch>=2.8 that ZeroGPU requires.
    """

    def __init__(self, margin: float = 1.3, score_threshold: float = 0.6):
        self._margin = margin
        self._detector = cv2.FaceDetectorYN.create(
            str(MODEL_PATH), "", (320, 320), score_threshold
        )

    def largest_face(self, image: Image.Image) -> Face:
        rgb = image.convert("RGB")
        bgr = cv2.cvtColor(np.asarray(rgb), cv2.COLOR_RGB2BGR)

        height, width = bgr.shape[:2]
        self._detector.setInputSize((width, height))
        _, faces = self._detector.detect(bgr)
        if faces is None or len(faces) == 0:
            raise NoFaceDetectedError("no face detected")

        best = max(faces, key=lambda f: f[2] * f[3])
        box = self._square_crop_box(best[:4], (width, height))
        return Face(image=rgb.crop(box), box=box, confidence=float(best[-1]))

    def _square_crop_box(self, xywh, size: tuple[int, int]) -> BoundingBox:
        width, height = size
        x, y, w, h = xywh
        cx, cy = x + w / 2, y + h / 2
        half = max(w, h) * self._margin / 2

        left = max(0, int(cx - half))
        top = max(0, int(cy - half))
        right = min(width, int(cx + half))
        bottom = min(height, int(cy + half))
        return left, top, right, bottom
