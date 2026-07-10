from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Column, SQLModel, Field, Uuid


class CaptureBase(SQLModel):
    latitude: float
    longitude: float
    accuracy: float
    description: str


class Capture(CaptureBase, table=True):
    id: UUID = Field(
        default_factory=uuid4, sa_column=Column(Uuid(as_uuid=True), primary_key=True)
    )
    user_id: UUID = Field(foreign_key="user.id")
    image_path: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))
