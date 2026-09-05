import pytest
from fastapi.testclient import TestClient
from main import app, ClassificationResponse
import io

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_classify_invalid_file_type():
    file_content = b"Not an image"
    response = client.post(
        "/classify-road-image",
        files={"file": ("test.txt", file_content, "text/plain")}
    )
    assert response.status_code == 400
    assert "File must be an image" in response.json()["detail"]

def test_classify_no_api_key(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    file_content = b"fake image content"
    response = client.post(
        "/classify-road-image",
        files={"file": ("test.jpg", file_content, "image/jpeg")}
    )
    assert response.status_code == 500
    assert "GOOGLE_API_KEY" in response.json()["detail"]

