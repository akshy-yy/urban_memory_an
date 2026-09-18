package com.uims.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    // ── SLA Scorecard metrics (maintained by the nightly watchdog) ───

    /**
     * Rolling average of how many days past the 14-day restoration deadline
     * this department's projects have been, across all SLA-breached projects.
     */
    @Column(name = "avg_restoration_delay_days", nullable = false)
    private Double avgRestorationDelayDays = 0.0;

    /**
     * Total number of scheduling conflicts that projects belonging to
     * this department have caused for other departments.
     */
    @Column(name = "total_conflicts_caused", nullable = false)
    private Integer totalConflictsCaused = 0;
}
