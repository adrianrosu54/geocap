from fastapi.security import HTTPAuthorizationCredentials
from fastapi.testclient import TestClient

from app.models.user import User
from app.services.token_utils import verify_token

from conftest import example_user_creation


def test_auth_register(client: TestClient):
    response = client.post(
        "/auth/register",
        data=example_user_creation,
    )

    assert response.status_code == 200

    data: dict = response.json()

    assert data["username"] == "johndoe"


def test_auth_login(user_data: tuple[User, str], client: TestClient):
    user = user_data[0]
    password = user_data[1]

    response = client.post(
        "/auth/login",
        data={
            "username": user.username,
            "password": password,
        },
    )

    assert response.status_code == 200

    data: dict = response.json()

    assert data["token_type"] == "Bearer"
    assert verify_token(
        HTTPAuthorizationCredentials(scheme="Bearer", credentials=data["access_token"])
    ).sub == str(user.id)
