from io import BytesIO
from uuid import uuid4

from fastapi.testclient import TestClient

from test_captures import capture_endpoint
from conftest import example_capture_creation

upload_endpoint = "/api/uploads"


def test_get_upload(image_file: BytesIO, auth_client: TestClient):
    img = image_file.read()

    r1 = auth_client.post(
        capture_endpoint,
        files={"image_file": ("image.jpg", img, "image/jpeg")},
        data=example_capture_creation,
    )

    assert r1.status_code == 200
    image_path: str = r1.json()["image_path"]
    url = f"{upload_endpoint}/{image_path}"
    print(url)

    # response = auth_client.get(url)

    # assert response.status_code != 404


def test_get_upload_missing(auth_client: TestClient):
    value = uuid4()
    response = auth_client.get(f"{upload_endpoint}/{value}/{value}.jpeg")

    assert response.status_code == 404
