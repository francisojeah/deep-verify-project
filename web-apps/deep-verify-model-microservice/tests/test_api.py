from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from deepverify.api import app

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


def _upload(client: TestClient, name: str, content: bytes | None = None):
    payload = content if content is not None else (FIXTURES / name).read_bytes()
    return client.post("/v1/detect", files={"file": (name, payload, "image/png")})


def test_health_reports_model(client: TestClient):
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert body["model_id"].startswith("yermandy/deepfake-detection")
    assert len(body["weights_sha256"]) == 64


def test_detect_returns_a_score(client: TestClient):
    body = _upload(client, "real.png").json()
    assert 0.0 <= body["fake_probability"] <= 1.0
    assert body["label"] in {"fake", "real"}
    assert body["is_deepfake"] is (body["fake_probability"] >= body["threshold"])


def test_face_free_image_is_rejected_not_scored(client: TestClient):
    response = _upload(client, "no_face.png")
    assert response.status_code == 422
    assert "no face" in response.json()["detail"].lower()


def test_non_image_is_rejected(client: TestClient):
    response = _upload(client, "notes.txt", content=b"this is not an image")
    assert response.status_code == 400


def test_run_prediction_is_the_seam_the_route_uses(client: TestClient, monkeypatch):
    """The Space replaces run_prediction to scope inference to the GPU window.

    If the route ever calls the detector directly again, that override silently
    stops applying and ZeroGPU deployments break outside a GPU context.
    """
    from deepverify import api
    from deepverify.detector import Prediction

    monkeypatch.setattr(
        api,
        "run_prediction",
        lambda image: Prediction(
            fake_probability=0.75,
            real_probability=0.25,
            threshold=0.5,
            face_box=(1, 2, 3, 4),
            face_confidence=0.9,
        ),
    )

    body = _upload(client, "real.png").json()
    assert body["fake_probability"] == 0.75
    assert body["face_box"] == [1, 2, 3, 4]
