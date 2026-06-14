import sqlite3
from sqlalchemy import Engine, event
from sqlmodel import SQLModel, Session, create_engine

import app.models.capture
import app.models.user

SQLITE_FILE_NAME = "database.db"
SQLITE_URL = f"sqlite:///{SQLITE_FILE_NAME}"

engine = create_engine(
    SQLITE_URL, connect_args={"check_same_thread": False}, echo="debug"
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
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
