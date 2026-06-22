from fastapi.testclient import TestClient
import jwt

from app.services.token_utils import JWT_ALGORITHM, JWT_SECRET


def test_get_me(auth_client: TestClient):
    response = auth_client.get("/users/me")
    data = response.json()

    decoded = jwt.decode(
        auth_client.headers["Authorization"][7:], JWT_SECRET, algorithms=JWT_ALGORITHM
    )

    assert int(data["id"]) == int(decoded["sub"])
