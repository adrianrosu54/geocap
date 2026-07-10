from datetime import datetime, timezone
from uuid import uuid4, UUID

from sqlmodel import Column, Field, SQLModel, Uuid


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)


# database stored data
class User(UserBase, table=True):
    id: UUID = Field(
        default_factory=uuid4, sa_column=Column(Uuid(as_uuid=True), primary_key=True)
    )
    password_hash: str
    created_at: datetime = Field(default=datetime.now(timezone.utc))
