from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from app.config import get_settings
from app.schemas.auth import TokenPayload

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
        # print(f"Token: {token}")
        payload = TokenPayload(
            **jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        )
        # print(f"Payload: {payload}")

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token has expired!")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token!")
