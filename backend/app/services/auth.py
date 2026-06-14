from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from pwdlib import PasswordHash
from sqlalchemy.exc import DatabaseError
from sqlmodel import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from app.models.user import User
from app.schemas.auth import LoginRequest, Token, TokenPayload
from app.schemas.user import UserCreate
from app.services.user import get_user_by_identifier
from app.config import get_settings

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("nothingpassword")

JWT_SECRET = get_settings().jwt_secret
JWT_EXP_MINUTES = get_settings().jwt_exp_minutes
JWT_ALGORITHM = "HS256"

security_scheme = HTTPBearer()


def create_access_token(subject: int | None):
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)

    payload = TokenPayload(sub=str(subject), exp=str(int(expire.timestamp())))

    encoded_jwt = jwt.encode(payload.model_dump(), JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
):
    try:
        token = credentials.credentials
        print(f"Token: {token}")
        payload = TokenPayload(
            **jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        )
        print(f"Payload: {payload}")

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(HTTP_401_UNAUTHORIZED, "Token has expired!")
    except jwt.InvalidTokenError:
        raise HTTPException(HTTP_401_UNAUTHORIZED, "Invalid token!")


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
