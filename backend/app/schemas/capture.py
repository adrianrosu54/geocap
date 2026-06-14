from datetime import datetime

from ..models.capture import CaptureBase


class CaptureCreate(CaptureBase):
    pass


class CaptureRead(CaptureBase):
    id: int
    user_id: int
    image_path: str
    created_at: datetime
