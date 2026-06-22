from typing import Annotated

from fastapi import File, HTTPException, UploadFile, status
from sqlmodel import Session, and_, select
from sqlalchemy.exc import DatabaseError, NoResultFound

from app.models.capture import Capture
from app.schemas.capture import CaptureCreate
from app.storage import delete_upload, save_upload

ALLOWED_FILE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


async def validate_image_file(
    image_file: Annotated[UploadFile, File()],
) -> UploadFile:
    if image_file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Unsupported image type"
        )

    contents = await image_file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, "Image too large")

    await image_file.seek(0)  # reset read
    return image_file


async def upload_capture(
    image_file: UploadFile,
    capture_create: CaptureCreate,
    user_id: int,
    session: Session,
):
    capture_path = await save_upload(image_file, user_id)

    capture = Capture(
        user_id=user_id, image_path=capture_path, **capture_create.model_dump()
    )

    try:
        session.add(capture)
        session.commit()
    except DatabaseError:
        session.rollback()
        delete_upload(capture_path)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't upload metadata")

    return capture


def read_captures(user_id: int, session: Session):
    try:
        captures = session.exec(select(Capture).where(Capture.user_id == user_id)).all()
        return captures
    except DatabaseError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't read captures")


def fetch_capture_by_id(capture_id: int, user_id: int, session: Session):
    try:
        capture = session.exec(
            select(Capture).where(
                and_(Capture.user_id == user_id, Capture.id == capture_id)
            )
        ).first()

        if not capture:
            raise NoResultFound()

        return capture
    except NoResultFound:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No captures found")
    except DatabaseError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't read captures")
