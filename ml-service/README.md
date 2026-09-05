# UIMS ML Service

This is a standalone Python FastAPI microservice for classifying images related to road infrastructure complaints.

## Setup

The service is integrated via `docker-compose.yml`.
Ensure you have set the `GOOGLE_API_KEY` environment variable on your system or in your docker-compose file.

### Manual Local Run
If you prefer not to use Docker:
```bash
cd ml-service
pip install -r requirements.txt
export GOOGLE_API_KEY="your_api_key_here"
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API
- `GET /health` : Health check.
- `POST /classify-road-image` : Accepts a multipart `file` upload and returns a JSON classification result indicating `is_road_related`, `urgency_score`, and `reason`.
