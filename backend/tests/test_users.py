from uuid import UUID
from fastapi.testclient import TestClient
import jwt

from app.config import get_settings
from app.services.token_utils import JWT_ALGORITHM


def test_get_me(auth_client: TestClient):
    response = auth_client.get("/api/users/me")
    data = response.json()

    decoded = jwt.decode(
        auth_client.headers["Authorization"][7:],
        get_settings().jwt_secret,
        algorithms=JWT_ALGORITHM,
    )

    assert UUID(data["id"]) == UUID(decoded["sub"])
