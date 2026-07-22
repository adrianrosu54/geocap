import uuid

from fastapi import UploadFile

from app.config import get_settings


ALLOWED_EXTENSIONS = {"image/jpeg": ".jpeg", "image/png": ".png", "image/webp": ".webp"}


def init_storage():
    get_settings().image_upload_dir.mkdir(parents=True, exist_ok=True)


def get_user_dir(user_id: uuid.UUID):
    path = get_settings().image_upload_dir / str(user_id)
    path.mkdir(parents=True, exist_ok=True)

    return path


async def save_upload(
    image_file: UploadFile, user_id: uuid.UUID, image_id: uuid.UUID | None = None
):
    extention = ALLOWED_EXTENSIONS[str(image_file.content_type)]
    filename = (
        f"{uuid.uuid4()}{extention}" if image_id is None else f"{image_id}{extention}"
    )

    destination = get_user_dir(user_id) / filename

    contents = await image_file.read()
    destination.write_bytes(contents)

    return str(destination.relative_to(get_settings().image_upload_dir))


def delete_upload(relative_path: str):
    full_path = get_settings().image_upload_dir / relative_path
    full_path.unlink(missing_ok=True)
