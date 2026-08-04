package com.uims.backend.repository;

import com.uims.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssignedDepartmentId(Long departmentId);
    List<Complaint> findByRoadId(Long roadId);
}
