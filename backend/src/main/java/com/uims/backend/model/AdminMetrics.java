package com.uims.backend.model;

import lombok.Data;

@Data
public class AdminMetrics {
    private long totalProjects;
    private long activeProjects;
    private long totalComplaints;
    private long pendingComplaints;
    private long registeredDepartments;
    private long conflictsPrevented;
}
