-- Urban Infrastructure Memory System (UIMS)
-- Production Database Schema (PostgreSQL / Standard SQL)
-- This file defines the tables, primary keys, foreign keys, and relationships.

-- 1. DEPARTMENT (Strong Entity)
CREATE TABLE departments (
    dept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL, -- e.g., Water, Telecom, PWD
    nodal_officer_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOCATION (Strong Entity)
CREATE TABLE locations (
    loc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    road_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    spatial_boundary GEOMETRY(POLYGON, 4326) -- GIS Polygon Data for map interlocking
);

-- 3. CITIZEN (Strong Entity)
CREATE TABLE citizens (
    citizen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aadhar_hash VARCHAR(255) UNIQUE NOT NULL, -- Encrypted Aadhar for privacy
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    urban_credits INT DEFAULT 0, -- Gamification points
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONTRACTOR (Strong Entity)
CREATE TABLE contractors (
    contractor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 1.0 AND rating <= 5.0) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. PROJECT (Regular Entity / Associative)
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_id UUID NOT NULL,
    loc_id UUID NOT NULL,
    contractor_id UUID,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., Excavation, Paving
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Planned', -- Planned, Active, Completed
    budget DECIMAL(15, 2),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    FOREIGN KEY (loc_id) REFERENCES locations(loc_id),
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id)
);

-- 6. PROJECT_MILESTONE (Weak Entity dependent on PROJECT)
CREATE TABLE project_milestones (
    project_id UUID NOT NULL,
    milestone_seq INT NOT NULL,
    description TEXT NOT NULL,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (project_id, milestone_seq), -- Composite Primary Key
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- 7. COMPLAINT (Regular Entity / Associative)
CREATE TABLE complaints (
    complaint_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL,
    loc_id UUID NOT NULL,
    assigned_dept_id UUID,
    description TEXT NOT NULL,
    urgency_level INT CHECK (urgency_level >= 1 AND urgency_level <= 10),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Assigned, Resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id),
    FOREIGN KEY (loc_id) REFERENCES locations(loc_id),
    FOREIGN KEY (assigned_dept_id) REFERENCES departments(dept_id)
);

-- 8. COMPLAINT_IMAGE (Weak Entity dependent on COMPLAINT)
CREATE TABLE complaint_images (
    complaint_id UUID NOT NULL,
    image_seq INT NOT NULL,
    s3_bucket_url VARCHAR(500) NOT NULL,
    is_ai_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (complaint_id, image_seq), -- Composite Primary Key
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- 9. CONFLICT (Associative Entity resolving M:N between Projects)
CREATE TABLE conflicts (
    conflict_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_a_id UUID NOT NULL,
    project_b_id UUID NOT NULL,
    conflict_type VARCHAR(100) NOT NULL, -- e.g., Temporal Overlap, Spatial Overlap
    resolution_status VARCHAR(50) DEFAULT 'Unresolved', -- Unresolved, Merged, Rescheduled
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_a_id) REFERENCES projects(project_id),
    FOREIGN KEY (project_b_id) REFERENCES projects(project_id),
    CHECK (project_a_id != project_b_id) -- Prevent conflict with itself
);

-- Indexes for performance on frequently queried columns
CREATE INDEX idx_project_dates ON projects(start_date, end_date);
CREATE INDEX idx_complaint_urgency ON complaints(urgency_level DESC);
CREATE INDEX idx_location_coords ON locations(latitude, longitude);
