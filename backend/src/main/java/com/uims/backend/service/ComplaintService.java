package com.uims.backend.service;

import com.uims.backend.model.*;
import com.uims.backend.repository.ComplaintRepository;
import com.uims.backend.repository.RoadRepository;
import com.uims.backend.repository.UserRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private RoadRepository roadRepository;

    @Autowired
    private UserRepository userRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Autowired
    private com.uims.backend.repository.ComplaintImageRepository complaintImageRepository;

    public Complaint createComplaint(ComplaintRequest request, String email) {
        User citizen = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Road road = roadRepository.findById(request.getRoadId())
                .orElseThrow(() -> new RuntimeException("Road not found"));

        Complaint complaint = new Complaint();
        complaint.setCategory(request.getCategory());
        complaint.setDescription(request.getDescription());
        complaint.setCitizen(citizen);
        complaint.setRoad(road);
        
        Point location = geometryFactory.createPoint(new Coordinate(request.getLng(), request.getLat()));
        complaint.setLocation(location);
        complaint.setStatus("PENDING");

        Complaint savedComplaint = complaintRepository.save(complaint);

        if (request.getMlStatus() != null) {
            ComplaintImage image = new ComplaintImage();
            image.setComplaint(savedComplaint);
            image.setIsRoadRelated(request.getIsRoadRelated());
            image.setRoadRelevanceConfidence(request.getRoadRelevanceConfidence());
            image.setUrgencyScore(request.getUrgencyScore());
            image.setUrgencyReasoning(request.getUrgencyReasoning());
            image.setSuggestedCategory(request.getSuggestedCategory());
            image.setMlModelVersion(request.getMlModelVersion());
            image.setMlProcessedAt(request.getMlProcessedAt());
            image.setMlStatus(request.getMlStatus());
            complaintImageRepository.save(image);
        }

        return savedComplaint;
    }

    public List<Complaint> getComplaintsByCitizen(String email) {
        User citizen = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByCitizenId(citizen.getId());
    }

    public List<Complaint> getComplaintsByDepartment(Long deptId) {
        return complaintRepository.findByAssignedDepartmentId(deptId);
    }
    
    public Complaint updateComplaintStatus(Long complaintId, String status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}
