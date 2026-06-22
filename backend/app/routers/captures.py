from typing import Annotated, List

from fastapi import APIRouter, Depends, Form, Path, UploadFile
from sqlmodel import Session

from app.database import get_session
from app.schemas.capture import CaptureCreate, CaptureRead
from app.services.capture import (
    fetch_capture_by_id,
    read_captures,
    upload_capture,
    validate_image_file,
)
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


@router.get("/", response_model=List[CaptureRead])
async def get_captures(
    user_id: Annotated[int, Depends(validate_user_id)],
    session: Annotated[Session, Depends(get_session)],
):
    return read_captures(user_id, session)


@router.get("/{capture_id}", response_model=CaptureRead)
async def get_capture(
    capture_id: Annotated[int, Path()],
    user_id: Annotated[int, Depends(validate_user_id)],
    session: Annotated[Session, Depends(get_session)],
):
    return fetch_capture_by_id(capture_id, user_id, session)
