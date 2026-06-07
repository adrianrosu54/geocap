from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from ..config import get_settings

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("nothingpassword")

JWT_SECRET = get_settings().jwt_secret
JWT_EXP_MINUTES = get_settings().jwt_exp_minutes
JWT_ALGORITHM = "HS256"


def hash_password(passwd: str):
    return password_hash.hash(passwd)


def verify_password(request_password: str, stored_hash: str):
    return password_hash.verify(request_password, stored_hash)


def create_access_token(subject: int | None):
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)

    to_encode = {"sub": subject, "exp": expire}

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")

    return encoded_jwt
