from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    jwt_secret: str
    jwt_exp_minutes: int = 30

    image_upload_dir: Path = Path("images")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache()
def get_settings():
    """Handle and return env variables"""
    return Settings()  # pyright: ignore
