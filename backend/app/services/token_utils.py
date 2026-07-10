from datetime import datetime, timedelta, timezone
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from app.config import get_settings
from app.schemas.auth import TokenPayload

JWT_ALGORITHM = "HS256"

security_scheme = HTTPBearer()


def create_access_token(subject: UUID):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=get_settings().jwt_exp_minutes
    )

    payload = TokenPayload(sub=str(subject), exp=str(int(expire.timestamp())))

    encoded_jwt = jwt.encode(
        payload.model_dump(), get_settings().jwt_secret, algorithm=JWT_ALGORITHM
    )
    return encoded_jwt


def verify_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
):
    try:
        token = credentials.credentials
        decoded = jwt.decode(
            token, get_settings().jwt_secret, algorithms=[JWT_ALGORITHM]
        )
        # print(f"Token: {token}")
        payload = TokenPayload(**decoded)
        # print(f"Payload: {payload.sub}")

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token has expired!")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token!")
