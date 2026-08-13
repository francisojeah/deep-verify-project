from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DEEPVERIFY_", env_file=".env", extra="ignore")

    weights_repo: str = "yermandy/deepfake-detection"
    weights_file: str = "model.torchscript"
    processor_repo: str = "openai/clip-vit-large-patch14"

    device: str = "auto"
    """auto resolves to cuda, then mps, then cpu."""

    face_margin: float = 1.3
    """Square crop side as a multiple of the longest bounding-box edge."""

    face_score_threshold: float = 0.6
    decision_threshold: float = 0.5
    max_upload_bytes: int = 10 * 1024 * 1024
    allowed_origins: str = "*"


@lru_cache
def get_settings() -> Settings:
    return Settings()
