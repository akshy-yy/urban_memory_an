import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "ok"
    
def test_recommend_window_invalid_date():
    response = client.post("/recommend-window", json={
        "segment_id": "1",
        "duration_hours": 2,
        "earliest_start": "invalid",
        "latest_end": "invalid"
    })
    assert response.status_code == 400
