from pathlib import Path

import pytest
import io

from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import Engine
from sqlmodel import SQLModel, Session, StaticPool, create_engine

from app.config import Settings
from app.database import get_session
from app.main import app as application
from app.models.capture import Capture
from app.schemas.auth import Token
from app.schemas.user import UserCreate
from app.models.user import User
from app.services.auth import password_hash

capture_endpoint = "/captures"


TEST_DB_URL = "sqlite:///:memory:"

example_user_creation = {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "secretpass",
}

example_capture_creation = {
    "latitude": 34.052235,
    "longitude": -118.243683,
    "accuracy": 100,
    "description": "Picture of the Pacific seaside",
}


@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine: Engine):
    with Session(engine) as session:
        yield session
        session.rollback()


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        yield session

    application.dependency_overrides[get_session] = get_session_override

    with TestClient(application) as client:
        yield client

    application.dependency_overrides.clear()


@pytest.fixture(name="auth_client")
def auth_client_fixture(user_data: tuple[User, str], client: TestClient):
    user = user_data[0]
    password = user_data[1]
    response = client.post(
        "/auth/login",
        data={
            "identifier": user.username,
            "password": password,
        },
    )

    token = Token(**response.json())
    client.headers["Authorization"] = f"bearer {token.access_token}"

    return client


@pytest.fixture(name="user_data")
def user_data_fixture(session: Session):
    userLogin = UserCreate(**example_user_creation)
    user = User(
        **userLogin.model_dump(), password_hash=password_hash.hash(userLogin.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user, userLogin.password


@pytest.fixture(name="image_file")
def image_file_fixture():
    buf = io.BytesIO()
    img = Image.new("RGB", (100, 100), color=(255, 128, 0))
    img.save(buf, format="JPEG")
    buf.seek(0)

    return buf


@pytest.fixture(name="added_capture")
def added_capture_fixture(image_file: io.BytesIO, auth_client: TestClient):
    img = image_file.read()

    response = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )

    return Capture(**response.json())


@pytest.fixture
def test_settings(tmp_path: Path):
    return Settings(
        jwt_secret="101010101010101010101010101010101010",
        jwt_exp_minutes=10,
        image_upload_dir=tmp_path,
    )


@pytest.fixture(autouse=True)
def override_settings(monkeypatch: pytest.MonkeyPatch, test_settings: Settings):
    """
    Overrides the main settings class and changes the upload directory to a
    temporary file
    """
    monkeypatch.setattr("app.config.get_settings", lambda: test_settings)
    monkeypatch.setattr("app.storage.get_settings", lambda: test_settings)
    monkeypatch.setattr("app.main.get_settings", lambda: test_settings)
