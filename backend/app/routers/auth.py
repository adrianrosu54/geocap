from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import DatabaseError
from sqlmodel import Session, or_, select

from ..database import get_session
from ..models import LoginRequest, Token, User, UserCreate, UserRead
from ..middleware.auth import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth")


def get_user_by_identifier(session: Session, identifier: str) -> User | None:
    return session.exec(
        select(User).where(or_(User.username == identifier, User.email == identifier))
    ).first()


@router.post("/register", response_model=UserRead)
async def register_user(user: UserCreate, session: Session = Depends(get_session)):

    userdb = User(**user.model_dump(), password_hash=hash_password(user.password))

    session.begin()
    try:
        session.add(userdb)
        session.commit()
    except DatabaseError:
        session.rollback()
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Couldn't register!")

    return userdb


@router.post("/token")
async def login_user(request: LoginRequest, session: Session = Depends(get_session)):
    user = get_user_by_identifier(session, request.identifier)

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials!")

    token = create_access_token(subject=user.id)
    return Token(access_token=token)
