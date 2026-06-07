from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel, Field


"""User data model"""


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(unique=True)


# database stored data
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))


# user input at register
class UserCreate(UserBase):
    password: str


# user API output
class UserRead(UserBase):
    id: int
    created_at: datetime


"""Capture data model"""


class CaptureBase(SQLModel):
    latitude: float
    longitude: float
    accuracy: float
    timestamp: datetime
    timezone: str  # IANA timezone string


class Capture(CaptureBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    image_path: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))


class CaptureCreate(CaptureBase):
    pass


class CaptureRead(CaptureBase):
    id: int
    user_id: int
    image_path: str
    created_at: datetime


"""Auth models"""


class LoginRequest(BaseModel):
    identifier: str  # username OR email
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
