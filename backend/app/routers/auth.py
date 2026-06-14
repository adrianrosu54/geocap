from typing import Annotated

from fastapi import APIRouter, Body, Depends
from sqlmodel import Session

from app.database import get_session
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate, UserRead
from app.services.auth import register_user, login_user

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserRead)
async def post_register(
    user: Annotated[UserCreate, Body()], session: Session = Depends(get_session)
):
    return register_user(user, session)


@router.post("/login", response_model=Token)
async def post_login(
    request: Annotated[LoginRequest, Body()], session: Session = Depends(get_session)
):
    return login_user(request, session)
