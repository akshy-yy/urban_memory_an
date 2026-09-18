-- Migration 03: Add Restoration SLA Watchdog columns and Approval Explainer Receipt
-- Projects: restoration_deadline, sla_breached, approval_receipt
-- Departments: avg_restoration_delay_days, total_conflicts_caused
--
-- NOTE: Spring Boot ddl-auto=update will apply these columns automatically on startup.
-- This file serves as a declarative reference for manual / CI migrations.

-- ──────────────────────────────────────────────────────────────────
-- Projects table additions
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS restoration_deadline  TIMESTAMP    NULL,
    ADD COLUMN IF NOT EXISTS sla_breached          BOOLEAN      NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS approval_receipt      TEXT         NULL;

-- Index to speed up the nightly SLA watchdog query
CREATE INDEX IF NOT EXISTS idx_project_sla_watchdog
    ON projects (status, sla_breached, restoration_deadline);

-- ──────────────────────────────────────────────────────────────────
-- Departments table additions (scorecard metrics)
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE departments
    ADD COLUMN IF NOT EXISTS avg_restoration_delay_days DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS total_conflicts_caused     INT              NOT NULL DEFAULT 0;
