package com.uims.backend.controller;

import com.uims.backend.model.ImpactReport;
import com.uims.backend.model.Project;
import com.uims.backend.model.ProjectRequest;
import com.uims.backend.model.User;
import com.uims.backend.repository.UserRepository;
import com.uims.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/analyze")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<ImpactReport> analyzeProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.analyzeProject(request));
    }

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        Project project = projectService.createProject(request, authentication.getName());
        return ResponseEntity.ok(project);
    }

    @GetMapping("/department")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<List<Project>> getDepartmentProjects(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(projectService.getDepartmentProjects(user.getDepartment().getId()));
    }
}
