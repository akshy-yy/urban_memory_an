-- Add new traffic-aware scheduling columns to the projects table
ALTER TABLE projects 
ADD COLUMN recommended_start_time DATETIME NULL,
ADD COLUMN recommended_end_time DATETIME NULL,
ADD COLUMN disruption_score_at_approval INT NULL;

-- Create traffic_snapshots table for the traffic-service (if sharing the MySQL DB)
CREATE TABLE IF NOT EXISTS traffic_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    segment_id VARCHAR(255) NOT NULL,
    road_name VARCHAR(255),
    city VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    timestamp DATETIME NOT NULL,
    current_speed_kmph DOUBLE,
    freeflow_speed_kmph DOUBLE,
    congestion_pct DOUBLE,
    source VARCHAR(50)
);

CREATE INDEX idx_traffic_snapshots_segment ON traffic_snapshots(segment_id);
CREATE INDEX idx_traffic_snapshots_timestamp ON traffic_snapshots(timestamp);
