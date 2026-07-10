from datetime import datetime
from uuid import UUID

from ..models.capture import CaptureBase


class CaptureCreate(CaptureBase):
    pass


class CaptureRead(CaptureBase):
    id: UUID
    user_id: UUID
    image_path: str
    created_at: datetime
