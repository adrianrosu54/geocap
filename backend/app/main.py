from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import create_db_and_tables
from app.routers import auth, users, captures
from app.storage import init_storage


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    init_storage()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(captures.router)
