from datetime import datetime

from ..models.user import UserBase


# user input at register
class UserCreate(UserBase):
    password: str


# user API output
class UserRead(UserBase):
    id: int
    created_at: datetime
