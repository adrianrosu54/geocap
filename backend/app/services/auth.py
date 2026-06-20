from typing import Annotated

from fastapi import Depends, Form, HTTPException, status
from pwdlib import PasswordHash
from sqlalchemy.exc import DatabaseError, IntegrityError
from sqlmodel import Session

from app.database import get_session
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate
from app.services.token_utils import create_access_token
from app.services.user import get_user_by_identifier

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("nothingpassword")


def register_user(
    user: Annotated[UserCreate, Form()],
    session: Annotated[Session, Depends(get_session)],
):
    userdb = User(**user.model_dump(), password_hash=password_hash.hash(user.password))

    session.begin()
    try:
        session.add(userdb)
        session.commit()
    except IntegrityError as e:
        session.rollback()
        if "username" in str(e.orig):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Username already taken!")
        elif "email" in str(e.orig):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already in use!")
        raise e
    except DatabaseError:
        session.rollback()
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't register!")

    return userdb


def login_user(
    request: Annotated[LoginRequest, Form()],
    session: Annotated[Session, Depends(get_session)],
):
    user = get_user_by_identifier(session, request.identifier)

    if not user:
        # verify anyway to not respond too fast (security measure)
        password_hash.verify(request.password, DUMMY_HASH)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials!")
    elif not password_hash.verify(request.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials!")

    token = create_access_token(subject=user.id)
    return Token(access_token=token)
