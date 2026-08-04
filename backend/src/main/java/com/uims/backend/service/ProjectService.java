package com.uims.backend.service;

import com.uims.backend.model.*;
import com.uims.backend.repository.ProjectRepository;
import com.uims.backend.repository.RoadRepository;
import com.uims.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoadRepository roadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImpactAnalysisService impactAnalysisService;

    public ImpactReport analyzeProject(ProjectRequest request) {
        Road road = roadRepository.findById(request.getRoadId())
                .orElseThrow(() -> new RuntimeException("Road not found"));

        List<String> conflicts = detectConflicts(request);
        return impactAnalysisService.analyzeImpact(request, road, conflicts);
    }

    public Project createProject(ProjectRequest request, String email) {
        User official = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (official.getRole() != Role.ROLE_DEPARTMENT || official.getDepartment() == null) {
            throw new RuntimeException("User does not have a department assigned");
        }

        Road road = roadRepository.findById(request.getRoadId())
                .orElseThrow(() -> new RuntimeException("Road not found"));

        ImpactReport report = analyzeProject(request);

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setWorkType(request.getWorkType());
        project.setRoad(road);
        project.setDepartment(official.getDepartment());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setLaneClosurePercentage(request.getLaneClosurePercentage());
        project.setImpactScore(report.getImpactScore());
        project.setImpactRecommendation(report.getRecommendation());
        
        // If there are conflicts and severity is critical, we might set status to PENDING_APPROVAL
        project.setStatus(report.getSeverity().equals("CRITICAL") ? "PENDING_APPROVAL" : "APPROVED");

        return projectRepository.save(project);
    }

    private List<String> detectConflicts(ProjectRequest request) {
        List<String> conflicts = new ArrayList<>();
        List<Project> existingProjects = projectRepository.findByRoadId(request.getRoadId());

        for (Project p : existingProjects) {
            // Check spatio-temporal overlap (naive check for overlapping dates on the same road)
            boolean dateOverlap = !(request.getEndDate().isBefore(p.getStartDate()) || request.getStartDate().isAfter(p.getEndDate()));
            
            if (dateOverlap && !p.getStatus().equals("COMPLETED") && !p.getStatus().equals("REJECTED")) {
                conflicts.add(p.getDepartment().getName() + " already has '" + p.getTitle() + "' planned during this time.");
            }

            // Check recent resurfacing rule
            if ("Resurfacing".equalsIgnoreCase(p.getWorkType()) && p.getStatus().equals("COMPLETED")) {
                // If it was completed within the last 6 months, and new work is excavation
                if (p.getEndDate().plusMonths(6).isAfter(request.getStartDate()) && request.getWorkType().contains("Excavation")) {
                    conflicts.add("Road was recently resurfaced on " + p.getEndDate() + ". Excavation is restricted for 6 months unless emergency.");
                }
            }
        }
        return conflicts;
    }

    public List<Project> getDepartmentProjects(Long departmentId) {
        return projectRepository.findByDepartmentId(departmentId);
    }
}
