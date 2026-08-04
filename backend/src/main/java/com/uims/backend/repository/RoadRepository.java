package com.uims.backend.repository;

import com.uims.backend.model.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadRepository extends JpaRepository<Road, Long> {
    List<Road> findByNameContainingIgnoreCase(String name);
}
