from typing import Annotated

from fastapi import APIRouter, Depends, Form, UploadFile
from sqlmodel import Session

from app.database import get_session
from app.schemas.capture import CaptureCreate, CaptureRead
from app.services.capture import upload_capture, validate_image_file
from app.services.user import validate_user_id

router = APIRouter(prefix="/captures")


@router.post("/", response_model=CaptureRead)
async def post_capture(
    latitude: Annotated[float, Form()],
    longitude: Annotated[float, Form()],
    accuracy: Annotated[float, Form()],
    description: Annotated[str, Form()],
    image_file: Annotated[UploadFile, Depends(validate_image_file)],
    user_id: Annotated[int, Depends(validate_user_id)],
    session: Annotated[Session, Depends(get_session)],
):
    return await upload_capture(
        image_file,
        CaptureCreate(
            latitude=latitude,
            longitude=longitude,
            accuracy=accuracy,
            description=description,
        ),
        user_id,
        session,
    )
