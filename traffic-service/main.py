from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import pandas as pd
from prophet import Prophet
import os
import joblib
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import httpx
import logging
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="UIMS Traffic Service")

logger = logging.getLogger("uvicorn.error")

# Database setup
# Using environment variables from docker-compose, default to localhost for testing
MYSQL_USER = os.getenv("MYSQL_USER", "uims_user")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "uims_password")
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")  # uims-mysql inside docker-compose
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "uims")

try:
    engine = create_engine(f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/{MYSQL_DATABASE}")
except Exception as e:
    logger.warning(f"Failed to connect to MySQL: {e}")
    engine = None

TRAFFIC_LIVE_MODE = os.getenv("TRAFFIC_LIVE_MODE", "false").lower() == "true"
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "")

os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

class ForecastResult(BaseModel):
    timestamp: str
    predicted_congestion_pct: float
    lower_bound: float
    upper_bound: float

class RecommendRequest(BaseModel):
    segment_id: str
    duration_hours: int
    earliest_start: str
    latest_end: str

class RecommendResponse(BaseModel):
    start_time: str
    end_time: str
    disruption_score: int
    reason: str

@app.get("/health")
def health_check():
    return {"status": "ok", "live_mode": TRAFFIC_LIVE_MODE}

@app.post("/ingest/tomtom")
async def ingest_tomtom():
    if not TRAFFIC_LIVE_MODE:
        return {"status": "skipped", "reason": "TRAFFIC_LIVE_MODE is false"}
    if not TOMTOM_API_KEY:
        return {"status": "skipped", "reason": "No TOMTOM_API_KEY provided"}
        
    # Mocking TomTom call
    logger.info("Ingesting TomTom traffic data...")
    # In a real scenario we'd parse TRAFFIC_SEGMENTS_JSON and call TomTom API
    # Writing dummy data to DB to simulate
    if engine:
        try:
            with engine.connect() as conn:
                conn.execute(text("""
                    INSERT INTO traffic_snapshots 
                    (segment_id, road_name, city, timestamp, current_speed_kmph, freeflow_speed_kmph, congestion_pct, source) 
                    VALUES ('1', 'MG Road', 'Bangalore', NOW(), 15.0, 60.0, 75.0, 'TOMTOM')
                """))
                conn.commit()
        except Exception as e:
            logger.error(f"Error inserting into DB: {e}")
            
    return {"status": "ingested"}

@app.post("/train")
def train_models():
    logger.info("Training models from CSV + MySQL data...")
    df_list = []
    
    # Load CSV
    csv_path = "data/bangalore_traffic.csv"
    if os.path.exists(csv_path):
        df_csv = pd.read_csv(csv_path)
        df_list.append(df_csv)
        
    # Load DB
    if engine:
        try:
            df_db = pd.read_sql("SELECT * FROM traffic_snapshots", con=engine)
            if not df_db.empty:
                df_list.append(df_db)
        except Exception as e:
            logger.warning(f"Could not read from DB: {e}")
            
    if not df_list:
        raise HTTPException(status_code=400, detail="No data available for training")
        
    df = pd.concat(df_list, ignore_index=True)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    segments = df['segment_id'].unique()
    
    for seg in segments:
        seg_df = df[df['segment_id'] == seg].copy()
        # Prophet requires 'ds' and 'y'
        seg_df = seg_df[['timestamp', 'congestion_pct']].rename(columns={'timestamp': 'ds', 'congestion_pct': 'y'})
        seg_df = seg_df.dropna()
        if len(seg_df) < 20:
            continue
            
        m = Prophet(yearly_seasonality=False, weekly_seasonality=True, daily_seasonality=True)
        m.fit(seg_df)
        
        joblib.dump(m, f"models/{seg}.pkl")
        
    return {"status": "trained", "segments": [str(s) for s in segments]}

def get_forecast(segment_id: str, days: int = 7) -> pd.DataFrame:
    model_path = f"models/{segment_id}.pkl"
    if not os.path.exists(model_path):
        # Fallback to training dummy if we have no models but have seed data
        train_models()
        if not os.path.exists(model_path):
             raise HTTPException(status_code=404, detail=f"Model for segment {segment_id} not found")
        
    m = joblib.load(model_path)
    
    future = m.make_future_dataframe(periods=24 * days, freq='H')
    forecast = m.predict(future)
    
    # Filter to only future predictions (from current hour onwards)
    now = pd.to_datetime(datetime.now().replace(minute=0, second=0, microsecond=0))
    # For testing, since our seed data ends at "now", we just take the last 24*days
    future_forecast = forecast[forecast['ds'] >= now].copy()
    if future_forecast.empty:
         # fallback if seed data is old
         future_forecast = forecast.tail(24*days).copy()
         
    # Ensure values are between 0 and 100
    future_forecast['yhat'] = future_forecast['yhat'].clip(0, 100)
    future_forecast['yhat_lower'] = future_forecast['yhat_lower'].clip(0, 100)
    future_forecast['yhat_upper'] = future_forecast['yhat_upper'].clip(0, 100)
    
    return future_forecast

@app.get("/forecast/{segment_id}")
def forecast_segment(segment_id: str, days: int = 7):
    forecast = get_forecast(segment_id, days)
    
    results = []
    for _, row in forecast.iterrows():
        results.append(ForecastResult(
            timestamp=row['ds'].strftime("%Y-%m-%d %H:%M:%S"),
            predicted_congestion_pct=round(row['yhat'], 2),
            lower_bound=round(row['yhat_lower'], 2),
            upper_bound=round(row['yhat_upper'], 2)
        ))
        
    return results

@app.get("/forecast/{segment_id}/weekly-summary")
def weekly_summary(segment_id: str):
    forecast = get_forecast(segment_id, days=7)
    
    # Matrix 7x24
    forecast['day_of_week'] = forecast['ds'].dt.dayofweek
    forecast['hour'] = forecast['ds'].dt.hour
    
    grouped = forecast.groupby(['day_of_week', 'hour'])['yhat'].mean().reset_index()
    
    matrix = []
    for d in range(7):
        day_data = []
        for h in range(24):
            val = grouped[(grouped['day_of_week'] == d) & (grouped['hour'] == h)]
            if not val.empty:
                day_data.append(round(val.iloc[0]['yhat'], 2))
            else:
                day_data.append(0.0)
        matrix.append(day_data)
        
    return matrix

@app.post("/recommend-window", response_model=List[RecommendResponse])
def recommend_window(req: RecommendRequest):
    try:
        earliest = pd.to_datetime(req.earliest_start)
        latest = pd.to_datetime(req.latest_end)
    except:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD HH:MM:SS")
        
    days = (latest - earliest).days + 1
    if days > 30:
        days = 30 # Limit forecast horizon
        
    forecast = get_forecast(req.segment_id, days=days)
    
    # Filter between earliest and latest
    mask = (forecast['ds'] >= earliest) & (forecast['ds'] <= latest)
    valid_forecast = forecast[mask].copy()
    
    if valid_forecast.empty:
        raise HTTPException(status_code=400, detail="No forecast available for given timeframe")
        
    windows = []
    # Sliding window of size req.duration_hours
    valid_forecast = valid_forecast.sort_values('ds').reset_index(drop=True)
    
    for i in range(len(valid_forecast) - req.duration_hours + 1):
        window_slice = valid_forecast.iloc[i:i+req.duration_hours]
        avg_congestion = window_slice['yhat'].mean()
        start_t = window_slice.iloc[0]['ds']
        end_t = window_slice.iloc[-1]['ds'] + timedelta(hours=1)
        
        # Reason generation
        if avg_congestion < 20:
            reason = "Optimal off-peak window with minimal predicted disruption."
        elif avg_congestion < 50:
            reason = "Moderate traffic period, acceptable for lane closures."
        else:
            reason = "High traffic period, expect significant disruption."
            
        windows.append({
            "start_time": start_t.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": end_t.strftime("%Y-%m-%d %H:%M:%S"),
            "disruption_score": int(avg_congestion),
            "reason": reason
        })
        
    # Sort by lowest disruption score
    windows.sort(key=lambda x: x["disruption_score"])
    
    # We return all valid windows; backend can filter them and pick top 3 non-conflicting
    return windows

scheduler = BackgroundScheduler()
scheduler.add_job(ingest_tomtom, 'interval', minutes=10)
scheduler.start()
