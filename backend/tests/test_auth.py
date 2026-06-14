from fastapi.security import HTTPAuthorizationCredentials
from fastapi.testclient import TestClient

from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth import verify_token

from conftest import example_registration


def test_auth_register(client: TestClient):
    response = client.post(
        "/auth/register",
        json=example_registration,
    )

    assert response.status_code == 200
    data: dict = response.json()
    assert data["username"] == "johndoe"
    assert data["email"] == "johndoe@example.com"


def test_auth_login(test_user: tuple[User, UserCreate], client: TestClient):
    response = client.post(
        "/auth/login",
        json={
            "identifier": test_user[1].username,
            "password": test_user[1].password,
        },
    )

    assert response.status_code == 200
    data: dict = response.json()
    assert data["token_type"] == "bearer"
    assert (
        verify_token(
            HTTPAuthorizationCredentials(
                scheme="bearer", credentials=data["access_token"]
            )
        ).sub
        == "1"
    )
