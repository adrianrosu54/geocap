from datetime import datetime
from uuid import UUID

from ..models.user import UserBase


# user input at register
class UserCreate(UserBase):
    password: str


# user API output
class UserRead(UserBase):
    id: UUID
    created_at: datetime
