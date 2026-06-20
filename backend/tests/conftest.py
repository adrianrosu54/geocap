import pytest

from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, StaticPool, create_engine

from app.database import get_session
from app.main import app as application
from app.schemas.user import UserCreate
from app.models.user import User
from app.services.auth import password_hash

TEST_DB_URL = "sqlite:///:memory:"

example_registration = {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "secretpass",
}


engine = create_engine(
    TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
)


@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)

    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        yield session

    application.dependency_overrides[get_session] = get_session_override
    client = TestClient(application)

    yield client

    application.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
    userLogin = UserCreate(**example_registration)
    user = User(
        **userLogin.model_dump(), password_hash=password_hash.hash(userLogin.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user, userLogin


@pytest.fixture(name="auth_token")
def auth_token_fixture(test_user: tuple[User, UserCreate], client: TestClient):
    response = client.post(
        "/auth/login",
        json={
            "identifier": test_user[1].username,
            "password": test_user[1].password,
        },
    )
    token = response.json()["access_token"]

    return token
