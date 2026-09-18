package com.uims.backend.controller;

import com.uims.backend.model.AdminMetrics;
import com.uims.backend.model.DepartmentSlaDto;
import com.uims.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminMetrics> getMetrics() {
        return ResponseEntity.ok(adminService.getSystemMetrics());
    }

    /**
     * Returns the Department SLA League Table — departments ranked from best
     * to worst SLA performance (ascending average restoration delay days).
     *
     * <p>Each entry includes:
     * <ul>
     *   <li>{@code name} — department name</li>
     *   <li>{@code avgRestorationDelayDays} — rolling average overdue days</li>
     *   <li>{@code totalConflictsCaused} — conflict events raised by this dept</li>
     *   <li>{@code slaBreachCount} — total SLA breaches ever recorded</li>
     *   <li>{@code slaRating} — Excellent / Good / Needs Improvement / Critical</li>
     * </ul>
     *
     * <p>Requires {@code ROLE_ADMIN}.
     */
    @GetMapping("/league-table")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DepartmentSlaDto>> getLeagueTable() {
        return ResponseEntity.ok(adminService.getDepartmentLeagueTable());
    }
}

