from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.user import User
from app.schemas.auth import TokenPayload
from app.services.token_utils import verify_token


def get_user_by_identifier(session: Session, username: str) -> User | None:
    return session.exec(select(User).where(User.username == username)).first()


def validate_user(
    token_payload: Annotated[TokenPayload, Depends(verify_token)],
    session: Annotated[Session, Depends(get_session)],
):
    # print(token_payload.sub)
    id = UUID(token_payload.sub)

    user = session.exec(select(User).where(User.id == id)).first()

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Couldn't find user")

    return User(**user.model_dump())


def validate_user_id(
    user: Annotated[User, Depends(validate_user)],
):
    return user.id
