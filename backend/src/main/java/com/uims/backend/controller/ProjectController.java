package com.uims.backend.controller;

import com.uims.backend.model.ImpactReport;
import com.uims.backend.model.Project;
import com.uims.backend.model.ProjectRequest;
import com.uims.backend.model.User;
import com.uims.backend.repository.UserRepository;
import com.uims.backend.service.ProjectService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
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

    /**
     * Transitions a project to a new status.
     *
     * <p>When {@code status} is set to {@code "COMPLETED"}, the service automatically
     * starts the 14-day restoration SLA countdown by persisting a
     * {@code restorationDeadline} timestamp on the project.
     *
     * <p>Department officials can only update projects belonging to their own
     * department. Admin users can update any project.
     *
     * @param id     project primary key (path variable)
     * @param body   JSON body with a single {@code status} field
     * @param auth   authenticated principal (used for ownership check)
     * @return the updated {@link Project} entity including new SLA fields
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DEPARTMENT', 'ADMIN')")
    public ResponseEntity<Project> updateProjectStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest body,
            Authentication auth) {
        Project updated = projectService.updateProjectStatus(id, body.getStatus(), auth.getName());
        return ResponseEntity.ok(updated);
    }

    // ── Inner request DTO ────────────────────────────────────────────────

    /** Minimal request body for the PATCH /status endpoint. */
    @Data
    public static class StatusUpdateRequest {
        @NotBlank(message = "status must not be blank")
        private String status;
    }
}

