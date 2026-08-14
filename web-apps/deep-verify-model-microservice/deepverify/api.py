import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel

from .config import get_settings
from .detector import NoFaceDetectedError, Prediction, get_detector

settings = get_settings()

app = FastAPI(
    title="DeepVerify detection service",
    description=(
        "Image deepfake detection using the pre-trained yermandy/deepfake-detection "
        "checkpoint (CLIP ViT-L/14 + LN-tuning, MIT). No model is trained here."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def run_prediction(image: Image.Image) -> Prediction:
    """Detect and score, in-process.

    A seam, not indirection: on ZeroGPU the forward pass has to happen inside a
    GPU-scoped function, so the Space replaces this with its own implementation
    and the route below stays identical in both deployments.
    """
    return get_detector().predict(image)


class Health(BaseModel):
    status: str
    model_id: str
    weights_sha256: str
    device: str
    threshold: float


class DetectionResponse(BaseModel):
    is_deepfake: bool
    label: str
    fake_probability: float
    real_probability: float
    threshold: float
    face_box: tuple[int, int, int, int]
    face_confidence: float
    model_id: str


@app.get("/health", response_model=Health)
def health() -> Health:
    detector = get_detector()
    return Health(
        status="ok",
        model_id=detector.model_id,
        weights_sha256=detector.weights_sha256,
        device=str(detector.device),
        threshold=detector.threshold,
    )


@app.post("/v1/detect", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...)) -> DetectionResponse:
    contents = await file.read()
    if len(contents) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"file exceeds {settings.max_upload_bytes // (1024 * 1024)}MB limit",
        )

    try:
        image = Image.open(io.BytesIO(contents))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="file is not a readable image")

    detector = get_detector()
    try:
        prediction = run_prediction(image)
    except NoFaceDetectedError:
        raise HTTPException(
            status_code=422,
            detail=(
                "no face detected. This detector is trained on face crops, so a score "
                "on a face-free image would be meaningless."
            ),
        )

    return DetectionResponse(
        is_deepfake=prediction.is_deepfake,
        label=prediction.label,
        fake_probability=prediction.fake_probability,
        real_probability=prediction.real_probability,
        threshold=prediction.threshold,
        face_box=prediction.face_box,
        face_confidence=prediction.face_confidence,
        model_id=detector.model_id,
    )
