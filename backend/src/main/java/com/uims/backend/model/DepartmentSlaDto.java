package com.uims.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight projection used by the Admin League Table endpoint.
 * Carries SLA performance metrics for a single department, pre-sorted
 * ascending by avgRestorationDelayDays (best performer first).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentSlaDto {

    /** Department primary key. */
    private Long id;

    /** Human-readable department name. */
    private String name;

    /** Sector (e.g., Water, Telecom, PWD). */
    private String description;

    /**
     * Rolling average days overdue across all SLA-breached projects
     * in this department. 0.0 means no breaches.
     */
    private Double avgRestorationDelayDays;

    /**
     * Total scheduling conflicts this department's projects have caused
     * for other departments (incremented by the SLA watchdog).
     */
    private Integer totalConflictsCaused;

    /** Number of projects where sla_breached = true. */
    private Long slaBreachCount;

    /**
     * Human-readable performance band derived from avgRestorationDelayDays:
     * <ul>
     *   <li><strong>Excellent</strong> — 0 days (no breaches)</li>
     *   <li><strong>Good</strong> — 1–3 days overdue on average</li>
     *   <li><strong>Needs Improvement</strong> — 4–10 days overdue on average</li>
     *   <li><strong>Critical</strong> — more than 10 days overdue on average</li>
     * </ul>
     */
    private String slaRating;
}
