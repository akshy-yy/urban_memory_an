package com.uims.backend.service;

import com.uims.backend.model.AdminMetrics;
import com.uims.backend.model.Department;
import com.uims.backend.model.DepartmentSlaDto;
import com.uims.backend.repository.ComplaintRepository;
import com.uims.backend.repository.DepartmentRepository;
import com.uims.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public AdminMetrics getSystemMetrics() {
        AdminMetrics metrics = new AdminMetrics();

        metrics.setTotalProjects(projectRepository.count());
        // For simplicity, consider anything not COMPLETED or REJECTED as active
        metrics.setActiveProjects(
            projectRepository.findAll().stream()
                .filter(p -> !p.getStatus().equals("COMPLETED") && !p.getStatus().equals("REJECTED"))
                .count()
        );

        metrics.setTotalComplaints(complaintRepository.count());
        metrics.setPendingComplaints(
            complaintRepository.findAll().stream()
                .filter(c -> c.getStatus().equals("PENDING"))
                .count()
        );

        metrics.setRegisteredDepartments(departmentRepository.count());

        // Mocked value for demonstration of the system's value proposition
        metrics.setConflictsPrevented(metrics.getTotalProjects() > 0 ? (metrics.getTotalProjects() / 3) + 2 : 0);

        return metrics;
    }

    /**
     * Returns a League Table of all departments sorted by SLA performance
     * (ascending average restoration delay — best performer first).
     *
     * <p>Each entry is a {@link DepartmentSlaDto} containing:
     * <ul>
     *   <li>Department identity fields</li>
     *   <li>{@code avgRestorationDelayDays} — maintained by the nightly SLA watchdog</li>
     *   <li>{@code totalConflictsCaused} — incremented whenever a watchdog breach is processed</li>
     *   <li>{@code slaBreachCount} — live count from the projects table</li>
     *   <li>{@code slaRating} — human-readable performance band (Excellent / Good / Needs Improvement / Critical)</li>
     * </ul>
     */
    public List<DepartmentSlaDto> getDepartmentLeagueTable() {
        List<Department> departments = departmentRepository.findAll();

        return departments.stream()
                .map(dept -> {
                    long breachCount = projectRepository.countByDepartmentIdAndSlaBreachedTrue(dept.getId());
                    String rating = computeSlaRating(dept.getAvgRestorationDelayDays());

                    return DepartmentSlaDto.builder()
                            .id(dept.getId())
                            .name(dept.getName())
                            .description(dept.getDescription())
                            .avgRestorationDelayDays(dept.getAvgRestorationDelayDays())
                            .totalConflictsCaused(dept.getTotalConflictsCaused())
                            .slaBreachCount(breachCount)
                            .slaRating(rating)
                            .build();
                })
                // Best performer (lowest delay) first
                .sorted(Comparator.comparingDouble(DepartmentSlaDto::getAvgRestorationDelayDays))
                .collect(Collectors.toList());
    }

    // ────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────

    /**
     * Maps a numeric delay to a human-readable SLA rating band.
     *
     * <ul>
     *   <li><strong>Excellent</strong>  — 0 days (no breaches ever recorded)</li>
     *   <li><strong>Good</strong>       — 1–3 days average overdue</li>
     *   <li><strong>Needs Improvement</strong> — 4–10 days average overdue</li>
     *   <li><strong>Critical</strong>   — more than 10 days average overdue</li>
     * </ul>
     */
    private String computeSlaRating(Double avgDelay) {
        if (avgDelay == null || avgDelay == 0.0) return "Excellent";
        if (avgDelay <= 3.0)                     return "Good";
        if (avgDelay <= 10.0)                    return "Needs Improvement";
        return "Critical";
    }
}

