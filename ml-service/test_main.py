import pytest
from fastapi.testclient import TestClient
from main import app

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

def test_cluster_complaints_empty():
    response = client.post("/cluster-complaints", json=[])
    assert response.status_code == 200
    assert response.json() == []

def test_cluster_complaints_single_cluster():
    # Create complaints close together (~5-10 meters apart)
    complaints = []
    for i in range(40):
        complaints.append({
            "id": i + 1,
            "lat": 40.7128 + (i * 0.00001),
            "lng": -74.0060 + (i * 0.00001),
            "urgency_score": 7.2,
            "category": "pothole"
        })

    response = client.post("/cluster-complaints", json=complaints)
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) == 1

    hotspot = hotspots[0]
    assert hotspot["report_count"] == 40
    assert hotspot["average_urgency"] == 7.2
    assert hotspot["category"] == "pothole"
    assert hotspot["summary"] == "Hotspot: 40 reports, avg urgency 7.2, category: pothole"
    assert len(hotspot["complaint_ids"]) == 40

def test_cluster_complaints_distinct_clusters():
    # Group 1: 3 complaints near NYC
    # Group 2: 2 complaints near LA (>3000 km away)
    complaints = [
        {"id": 1, "lat": 40.7128, "lng": -74.0060, "urgency_score": 8.0, "category": "pothole"},
        {"id": 2, "lat": 40.7129, "lng": -74.0061, "urgency_score": 6.0, "category": "pothole"},
        {"id": 3, "lat": 40.7127, "lng": -74.0059, "urgency_score": 7.0, "category": "pothole"},
        {"id": 4, "lat": 34.0522, "lng": -118.2437, "urgency_score": 4.0, "category": "garbage/debris"},
        {"id": 5, "lat": 34.0523, "lng": -118.2438, "urgency_score": 5.0, "category": "garbage/debris"},
    ]

    response = client.post("/cluster-complaints", json=complaints)
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) == 2

    # Hotspots are sorted by report_count descending
    assert hotspots[0]["report_count"] == 3
    assert hotspots[0]["average_urgency"] == 7.0
    assert hotspots[0]["category"] == "pothole"
    assert hotspots[0]["summary"] == "Hotspot: 3 reports, avg urgency 7.0, category: pothole"

    assert hotspots[1]["report_count"] == 2
    assert hotspots[1]["average_urgency"] == 4.5
    assert hotspots[1]["category"] == "garbage/debris"
    assert hotspots[1]["summary"] == "Hotspot: 2 reports, avg urgency 4.5, category: garbage/debris"

def test_cluster_complaints_object_payload():
    payload = {
        "complaints": [
            {"id": "C-101", "lat": 12.9716, "lng": 77.5946, "urgency_score": 9.0, "category": "open manhole"},
            {"id": "C-102", "lat": 12.9717, "lng": 77.5947, "urgency_score": 9.0, "category": "open manhole"}
        ]
    }
    response = client.post("/cluster-complaints", json=payload)
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) == 1
    assert hotspots[0]["report_count"] == 2
    assert hotspots[0]["average_urgency"] == 9.0
    assert hotspots[0]["category"] == "open manhole"
    assert "C-101" in hotspots[0]["complaint_ids"]
