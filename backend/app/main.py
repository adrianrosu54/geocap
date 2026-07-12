from contextlib import asynccontextmanager

from fastapi import FastAPI
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


app = FastAPI(lifespan=lifespan)

if get_settings().environment == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
    )

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(captures.router)

app.mount("/uploads", StaticFiles(directory=get_settings().image_upload_dir))
