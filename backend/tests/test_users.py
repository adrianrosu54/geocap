from fastapi.testclient import TestClient
import jwt

from app.services.auth import JWT_ALGORITHM, JWT_SECRET


def test_get_self(auth_token: str, client: TestClient):
    response = client.get(
        "/users/me", headers={"Authorization": f"bearer {auth_token}"}
    )
    # print(f"token: {auth_token}")
    data = response.json()
    # print(f"data: {data}")

    decoded = jwt.decode(auth_token, JWT_SECRET, algorithms=JWT_ALGORITHM)
    # print(f"decoded: {decoded}")

    assert int(data["id"]) == int(decoded["sub"])
