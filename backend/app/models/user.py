from datetime import datetime, timezone
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(unique=True)


# database stored data
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))
