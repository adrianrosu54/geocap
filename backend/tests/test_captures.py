from io import BytesIO

from conftest import TestClient, example_capture_creation

capture_endpoint = "/captures"


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
        "/captures",
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

    response = auth_client.get(f"{capture_endpoint}/1")

    assert response.status_code == 200
    assert response.json()["id"] == 1


def test_get_capture_missing(auth_client: TestClient):
    response = auth_client.get(f"{capture_endpoint}/1")

    assert response.status_code == 404
