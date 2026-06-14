from pydantic import BaseModel


class LoginRequest(BaseModel):
    identifier: str  # username OR email
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
