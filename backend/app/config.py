from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: Literal["production", "development"] = "production"
    frontend_url: str = "http://localhost:3000"

    jwt_secret: str
    jwt_exp_minutes: int = 30

    image_upload_dir: Path = Path("images")
    database_dir: Path = Path("data")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache()
def get_settings():
    """Handle and return env variables"""
    return Settings()  # pyright: ignore
