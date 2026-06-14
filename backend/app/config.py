from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    jwt_exp_minutes: int = 30
    jwt_secret: str


@lru_cache()
def get_settings():
    """Handle and return env variables"""
    return Settings()  # pyright: ignore
