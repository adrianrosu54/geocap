from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


class CaptureBase(SQLModel):
    latitude: float
    longitude: float
    accuracy: float
    description: str


class Capture(CaptureBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    image_path: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))
