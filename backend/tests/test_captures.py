from io import BytesIO
from pathlib import Path
from uuid import uuid4

from app.models.capture import Capture
from conftest import TestClient, example_capture_creation

from conftest import capture_endpoint


def test_post_captures(image_file: BytesIO, auth_client: TestClient):
    response = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", image_file.read(), "image/jpeg")},
        data=example_capture_creation,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["image_path"] != ""


def test_get_captures(image_file: BytesIO, auth_client: TestClient):
    img = image_file.read()

    r1 = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )
    assert r1.status_code == 200

    r2 = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )
    assert r2.status_code == 200

    response = auth_client.get(capture_endpoint)

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2


def test_get_captures_empty(auth_client: TestClient):
    response = auth_client.get(capture_endpoint)

    assert response.status_code == 200
    assert len(response.json()) == 0


def test_get_capture(image_file: BytesIO, auth_client: TestClient):
    img = image_file.read()

    r1 = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )
    assert r1.status_code == 200

    capture_id = r1.json()["id"]

    response = auth_client.get(f"{capture_endpoint}/{capture_id}")

    assert response.status_code == 200
    assert response.json()["id"] == capture_id


def test_get_capture_missing(auth_client: TestClient):
    response = auth_client.get(f"{capture_endpoint}/{uuid4()}")

    assert response.status_code == 404


def test_put_capture(
    added_capture: Capture, image_file: BytesIO, auth_client: TestClient
):
    img = image_file.read()

    example_capture_creation["description"] = "new description"

    response = auth_client.put(
        f"{capture_endpoint}/{added_capture.id}",
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )

    assert response.status_code == 200

    data = response.json()
    print(data)
    assert data["description"] == "new description"


def test_delete_capture(image_file: BytesIO, auth_client: TestClient, tmp_path: Path):
    img = image_file.read()

    r1 = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )
    assert r1.status_code == 200

    capture_id = r1.json()["id"]
    user_id = r1.json()["user_id"]

    response = auth_client.delete(f"{capture_endpoint}/{capture_id}")

    assert response.status_code == 200
    assert not any(Path(tmp_path / user_id).iterdir())
