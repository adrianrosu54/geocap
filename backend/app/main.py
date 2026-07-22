from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import create_db_and_tables
from app.routers import auth, users, captures
from app.storage import init_storage

init_storage()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


# API

api = APIRouter(prefix="/api")

api.include_router(auth.router)
api.include_router(users.router)
api.include_router(captures.router)

# App

app = FastAPI(lifespan=lifespan)


if get_settings().environment == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[get_settings().frontend_url],
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
    )

app.include_router(api)
app.mount("/api/uploads", StaticFiles(directory=get_settings().image_upload_dir))
