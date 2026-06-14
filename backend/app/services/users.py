from sqlmodel import Session, or_, select

from app.models.user import User


def get_user_by_identifier(session: Session, identifier: str) -> User | None:
    return session.exec(
        select(User).where(or_(User.username == identifier, User.email == identifier))
    ).first()
