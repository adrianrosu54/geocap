from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from .database import create_db_and_tables
from .routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


api = APIRouter(lifespan=lifespan)
api.include_router(auth.router)

app = FastAPI()
app.include_router(api)
