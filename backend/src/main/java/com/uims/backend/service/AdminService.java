package com.uims.backend.service;

import com.uims.backend.model.AdminMetrics;
import com.uims.backend.repository.ComplaintRepository;
import com.uims.backend.repository.DepartmentRepository;
import com.uims.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
