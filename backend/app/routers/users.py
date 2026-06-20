from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.schemas.auth import TokenPayload
from app.schemas.user import UserRead
from app.services.token_utils import verify_token
from app.services.user import validate_user


router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserRead)
async def get_own_user(
    token_payload: Annotated[TokenPayload, Depends(verify_token)],
    session: Annotated[Session, Depends(get_session)],
):
    return validate_user(token_payload, session)
