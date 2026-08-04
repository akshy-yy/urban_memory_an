package com.uims.backend.repository;

import com.uims.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByDepartmentId(Long departmentId);
    List<Project> findByRoadId(Long roadId);
    List<Project> findByStatus(String status);
}
