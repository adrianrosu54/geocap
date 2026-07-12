import sqlite3
from sqlalchemy import Engine, event
from sqlmodel import SQLModel, Session, create_engine

from app.config import get_settings
import app.models.capture
import app.models.user


engine = create_engine(
    f"sqlite:///{get_settings().database_dir}/database.db",
    connect_args={"check_same_thread": False},
    echo=False if get_settings().environment == "production" else "debug",
)


# pragmas on every new connection
@event.listens_for(Engine, "connect")
def set_sqlite_pragmas(dbapi_conn, _):
    if isinstance(dbapi_conn, sqlite3.Connection):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def create_db_and_tables():
    get_settings().database_dir.mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
