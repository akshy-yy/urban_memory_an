package com.uims.backend.repository;

import com.uims.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByDepartmentId(Long departmentId);
    List<Project> findByRoadId(Long roadId);
    List<Project> findByStatus(String status);

    /**
     * Used by the nightly SLA watchdog to find every COMPLETED project whose
     * restoration window has expired but has not yet been flagged as breached.
     */
    List<Project> findByStatusAndSlaBreachedFalseAndRestorationDeadlineBefore(
            String status, LocalDateTime cutoff);

    /**
     * Returns the number of SLA-breached projects for a specific department.
     * Used by AdminService to populate the League Table DTO.
     */
    long countByDepartmentIdAndSlaBreachedTrue(Long departmentId);

    /**
     * Returns all SLA-breached projects for a given department so the watchdog
     * can recompute the rolling average delay.
     */
    List<Project> findByDepartmentIdAndSlaBreachedTrue(Long departmentId);
}

