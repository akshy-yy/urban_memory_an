import csv
import random
from datetime import datetime, timedelta
import os

def generate_seed_data():
    segments = ["1", "2", "3"]
    end_date = datetime.now()
    start_date = end_date - timedelta(days=14)
    
    records = []
    
    curr = start_date
    dates = []
    while curr <= end_date:
        dates.append(curr)
        curr += timedelta(hours=1)
        
    for segment in segments:
        for d in dates:
            hour = d.hour
            if 8 <= hour <= 10 or 17 <= hour <= 19:
                base = 70 + random.gauss(0, 10)
            elif hour < 6 or hour > 22:
                base = 10 + random.gauss(0, 5)
            else:
                base = 40 + random.gauss(0, 10)
                
            if d.weekday() >= 5:
                base = base * 0.6
                
            congestion = max(0, min(100, base))
            
            records.append({
                "segment_id": segment,
                "road_name": f"Road {segment}",
                "city": "Bangalore",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "timestamp": d.strftime("%Y-%m-%d %H:%M:%S"),
                "current_speed_kmph": max(5, 60 - (congestion * 0.5)),
                "freeflow_speed_kmph": 60,
                "congestion_pct": congestion,
                "source": "KAGGLE_SEED"
            })
            
    os.makedirs("data", exist_ok=True)
    with open("data/bangalore_traffic.csv", "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)
    print("Seed data generated at data/bangalore_traffic.csv")

if __name__ == "__main__":
    generate_seed_data()
