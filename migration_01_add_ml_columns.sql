-- Migration to add ML classification columns to complaint_images
-- This script is a declarative reference; the Spring Boot app uses ddl-auto=update to apply this schema automatically.

ALTER TABLE complaint_images
ADD COLUMN is_road_related BOOLEAN,
ADD COLUMN road_relevance_confidence FLOAT,
ADD COLUMN urgency_score INT,
ADD COLUMN urgency_reasoning TEXT,
ADD COLUMN suggested_category VARCHAR(255),
ADD COLUMN ml_model_version VARCHAR(50),
ADD COLUMN ml_processed_at VARCHAR(100),
ADD COLUMN ml_status VARCHAR(50);
