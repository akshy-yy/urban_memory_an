package com.uims.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "work_type")
    private String workType; // e.g., Excavation, Resurfacing, Pipeline

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "road_id", nullable = false)
    private Road road;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "lane_closure_percentage")
    private Integer laneClosurePercentage;

    private String status; // PENDING, APPROVED, IN_PROGRESS, COMPLETED, REJECTED

    @Column(name = "impact_score")
    private Integer impactScore;

    @Column(name = "impact_recommendation", columnDefinition = "TEXT")
    private String impactRecommendation;

    @Column(name = "recommended_start_time")
    private LocalDateTime recommendedStartTime;

    @Column(name = "recommended_end_time")
    private LocalDateTime recommendedEndTime;

    @Column(name = "disruption_score_at_approval")
    private Integer disruptionScoreAtApproval;

    // ── SLA Watchdog fields ──────────────────────────────────────────
    /** Set to NOW + 14 days when the project transitions to COMPLETED. */
    @Column(name = "restoration_deadline")
    private LocalDateTime restorationDeadline;

    /** Flipped to true by the nightly watchdog when the deadline passes without sign-off. */
    @Column(name = "sla_breached", nullable = false)
    private Boolean slaBreached = false;

    // ── Approval Explainer Receipt ───────────────────────────────────
    /** Plain-English summary of why the project was approved or flagged. */
    @Column(name = "approval_receipt", columnDefinition = "TEXT")
    private String approvalReceipt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
