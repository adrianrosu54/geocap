from io import BytesIO

from conftest import TestClient, example_capture_creation


def test_post_captures(image_file: BytesIO, auth_client: TestClient):
    response = auth_client.post(
        "/captures",
        files={"image_file": ("image.jpg", image_file.read(), "image/jpeg")},
        data=example_capture_creation,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["image_path"] != ""
