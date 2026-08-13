from pathlib import Path

import pytest
from PIL import Image

from deepverify.detector import DeepfakeDetector
from deepverify.faces import NoFaceDetectedError

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture(scope="module")
def detector() -> DeepfakeDetector:
    return DeepfakeDetector()


def test_scores_a_face(detector: DeepfakeDetector):
    prediction = detector.predict(Image.open(FIXTURES / "real.png"))
    assert 0.0 <= prediction.fake_probability <= 1.0
    assert prediction.fake_probability + prediction.real_probability == pytest.approx(1.0)
    assert prediction.label in {"fake", "real"}


def test_is_deterministic(detector: DeepfakeDetector):
    image = Image.open(FIXTURES / "fake_wav2lip.png")
    assert detector.predict(image).fake_probability == detector.predict(image).fake_probability


def test_refuses_face_free_image(detector: DeepfakeDetector):
    with pytest.raises(NoFaceDetectedError):
        detector.predict(Image.open(FIXTURES / "no_face.png"))


def test_score_faces_skips_detection(detector: DeepfakeDetector):
    images = [Image.open(FIXTURES / "real.png"), Image.open(FIXTURES / "fake_wav2lip.png")]
    scores = detector.score_faces(images)
    assert len(scores) == 2
    assert all(0.0 <= s <= 1.0 for s in scores)


def test_reports_provenance(detector: DeepfakeDetector):
    assert detector.model_id.startswith("yermandy/deepfake-detection")
    assert len(detector.weights_sha256) == 64
