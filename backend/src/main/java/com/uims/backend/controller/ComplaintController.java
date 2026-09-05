package com.uims.backend.controller;

import com.uims.backend.model.Complaint;
import com.uims.backend.model.ComplaintRequest;
import com.uims.backend.model.User;
import com.uims.backend.repository.UserRepository;
import com.uims.backend.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.uims.backend.service.RoadImageClassificationService classificationService;

    @PostMapping("/classify-image")
    // @PreAuthorize("hasRole('CITIZEN')") -- Depending on if citizen is logged in during classification
    public ResponseEntity<java.util.Map<String, Object>> classifyImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(classificationService.classifyImage(file));
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintRequest request, Authentication authentication) {
        Complaint complaint = complaintService.createComplaint(request, authentication.getName());
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<Complaint>> getMyComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getComplaintsByCitizen(authentication.getName()));
    }

    @GetMapping("/department")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<List<Complaint>> getDepartmentComplaints(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(complaintService.getComplaintsByDepartment(user.getDepartment().getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }
}
