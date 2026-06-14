from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.schemas.auth import TokenPayload
from app.schemas.user import UserRead
from app.services.auth import verify_token
from app.services.user import get_user_self


router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserRead)
async def get_own_user(
    token_payload: Annotated[TokenPayload, Depends(verify_token)],
    session: Annotated[Session, Depends(get_session)],
):
    return get_user_self(token_payload, session)
