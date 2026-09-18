package com.uims.backend.controller;

import com.uims.backend.service.ProjectService;
import com.uims.backend.service.TrafficServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/roadworks")
public class TrafficController {

    @Autowired
    private TrafficServiceClient trafficServiceClient;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/traffic-forecast")
    public ResponseEntity<Map<String, Object>> getTrafficForecast(@RequestParam String segmentId) {
        List<Map<String, Object>> forecast = trafficServiceClient.getForecast(segmentId);
        List<List<Double>> weeklySummary = trafficServiceClient.getWeeklySummary(segmentId);

        Map<String, Object> response = new HashMap<>();
        response.put("forecast", forecast);
        response.put("weeklySummary", weeklySummary);
        
        if (forecast.isEmpty() && weeklySummary.isEmpty()) {
            response.put("error", "Traffic prediction temporarily unavailable");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/recommend-window")
    public ResponseEntity<List<Map<String, Object>>> recommendWindow(@RequestBody Map<String, Object> request) {
        // Fetch candidates from Python
        List<Map<String, Object>> candidates = trafficServiceClient.getRecommendations(request);
        
        if (candidates.isEmpty()) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("error", "Traffic prediction temporarily unavailable");
            return ResponseEntity.ok(Collections.singletonList(fallback));
        }

        List<Map<String, Object>> validWindows = new ArrayList<>();
        Long roadId = Long.parseLong(request.getOrDefault("segment_id", "1").toString());
        String workType = request.getOrDefault("work_type", "Excavation").toString();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Map<String, Object> candidate : candidates) {
            String startStr = (String) candidate.get("start_time");
            String endStr = (String) candidate.get("end_time");
            
            LocalDate startDate = LocalDateTime.parse(startStr, formatter).toLocalDate();
            LocalDate endDate = LocalDateTime.parse(endStr, formatter).toLocalDate();

            List<String> conflicts = projectService.detectConflicts(roadId, startDate, endDate, workType);
            
            if (conflicts.isEmpty()) {
                validWindows.add(candidate);
                if (validWindows.size() == 3) {
                    break;
                }
            }
        }
        
        return ResponseEntity.ok(validWindows);
    }
}
