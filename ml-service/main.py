import os
import json
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

app = FastAPI(title="UIMS ML Service")

MODEL_ID = "gemini-2.5-flash"

class ClassificationResponse(BaseModel):
    is_road_related: bool = Field(description="Whether the image is relevant to a road/street infrastructure issue.")
    road_relevance_confidence: float = Field(description="Confidence score between 0 and 1.")
    reason: str = Field(description="Short human-readable reason for the classification.")
    urgency_score: int | None = Field(None, description="Urgency score (1-10) if road related, else null.")
    urgency_reasoning: str | None = Field(None, description="Reasoning for the urgency score, else null.")
    suggested_category: str | None = Field(None, description="Suggested category like 'pothole', 'garbage/debris', 'waterlogging', 'open manhole', 'damaged footpath', 'excavation/digging', 'other', else null.")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/classify-road-image")
async def classify_road_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY environment variable is not set.")

    try:
        image_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not read the uploaded file.")

    client = genai.Client(api_key=api_key)
    
    prompt = """
    Analyze the image to determine if it is relevant to a road/street infrastructure issue. 
    This should be generous, not strict — the goal is to reject obviously unrelated photos (selfies, memes, indoor photos, screenshots, receipts, animals unrelated to a road, etc.), not to reject valid complaints.
    
    Treat an image as road-relevant if ANY of the following are visible:
    - A road surface, tar/asphalt/concrete pavement, footpath, or pothole.
    - Garbage, debris, waterlogging, construction material, or any obstruction that is on or blocking a road/path.
    - Damaged road infrastructure: broken manholes, exposed cables/pipes from digging, damaged signage/barricades on a road, broken streetlights on a road.
    - Any excavation or digging work visible on a street.
    
    If the image is road-relevant, score the urgency on a scale of 1 (cosmetic/low priority) to 10 (immediate danger to life/critical infrastructure failure).
    Concrete anchors:
    1–2: Minor cosmetic issue (faded paint, small crack, light litter).
    3–4: Moderate wear (small pothole, minor garbage accumulation, blocked drain with no standing water).
    5–6: Notable hazard (medium pothole, significant debris narrowing the path, damaged footpath).
    7–8: Serious hazard (large pothole likely to damage vehicles, exposed rebar/cables, deep waterlogging, broken barricade near traffic).
    9–10: Immediate danger to life (open manhole with no cover/barrier, major structural road collapse, live exposed electrical wiring, large sinkhole).
    
    Also, suggest a category from: "pothole", "garbage/debris", "waterlogging", "open manhole", "damaged footpath", "excavation/digging", "other".
    
    If is_road_related is false, urgency_score, urgency_reasoning, and suggested_category should be null.
    """
    
    image_part = types.Part.from_bytes(data=image_bytes, mime_type=file.content_type)
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[image_part, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ClassificationResponse,
                temperature=0.1
            ),
        )
        
        try:
            result_dict = json.loads(response.text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse model output as JSON.")
            
        validated_result = ClassificationResponse(**result_dict)
        
        response_data = validated_result.model_dump()
        response_data["model_version"] = MODEL_ID
        response_data["processed_at"] = datetime.now(timezone.utc).isoformat()
        
        return response_data
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")
