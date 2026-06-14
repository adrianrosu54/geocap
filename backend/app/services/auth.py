from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
import jwt
from pwdlib import PasswordHash
from sqlalchemy.exc import DatabaseError
from sqlmodel import Session

from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate
from app.services.users import get_user_by_identifier
from app.config import get_settings

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("nothingpassword")

JWT_SECRET = get_settings().jwt_secret
JWT_EXP_MINUTES = get_settings().jwt_exp_minutes
JWT_ALGORITHM = "HS256"


def create_access_token(subject: int | None):
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)

    to_encode = {"sub": subject, "exp": expire}

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt


def register_user(user: UserCreate, session: Session):
    userdb = User(**user.model_dump(), password_hash=password_hash.hash(user.password))

    session.begin()
    try:
        session.add(userdb)
        session.commit()
    except DatabaseError:
        session.rollback()
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't register!")

    return userdb


def login_user(request: LoginRequest, session: Session):
    user = get_user_by_identifier(session, request.identifier)

    if not user:
        # verify anyway to not respond too fast (security measure)
        password_hash.verify(request.password, DUMMY_HASH)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials!")
    elif not password_hash.verify(request.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials!")

    token = create_access_token(subject=user.id)
    return Token(access_token=token)
