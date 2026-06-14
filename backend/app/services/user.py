from fastapi import HTTPException, status
from sqlmodel import Session, or_, select

from app.models.user import User
from app.schemas.auth import TokenPayload
from app.schemas.user import UserRead


def get_user_by_identifier(session: Session, identifier: str) -> User | None:
    return session.exec(
        select(User).where(or_(User.username == identifier, User.email == identifier))
    ).first()


def get_user_self(token_payload: TokenPayload, session: Session) -> UserRead:
    id = token_payload.sub

    user = session.exec(select(User).where(User.id == id)).first()

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Couldn't find user")

    return UserRead(**user.model_dump())
