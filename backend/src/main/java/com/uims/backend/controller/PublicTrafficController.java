package com.uims.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/traffic")
public class PublicTrafficController {

    @GetMapping("/top-congested")
    public ResponseEntity<List<Map<String, Object>>> getTopCongested() {
        // In a real application, this would aggregate data from traffic-service.
        // For the demo, we mock the top congested corridors based on the requirement.
        List<Map<String, Object>> insights = new ArrayList<>();
        
        insights.add(createMockInsight("MG Road", "Bangalore", 82.5, 76.0, new double[]{60, 75, 80, 85, 90, 85, 70}));
        insights.add(createMockInsight("Outer Ring Road", "Bangalore", 78.0, 75.5, new double[]{70, 72, 75, 78, 80, 85, 80}));
        insights.add(createMockInsight("Silk Board Junction", "Bangalore", 90.5, 88.0, new double[]{80, 85, 90, 95, 95, 90, 85}));
        insights.add(createMockInsight("Indiranagar 100ft", "Bangalore", 65.0, 50.0, new double[]{50, 55, 60, 70, 80, 85, 60}));
        insights.add(createMockInsight("Whitefield Main", "Bangalore", 75.0, 70.0, new double[]{60, 65, 70, 80, 85, 75, 65}));
        insights.add(createMockInsight("Koramangala 80ft", "Bangalore", 72.0, 68.0, new double[]{55, 60, 65, 75, 85, 80, 60}));
        insights.add(createMockInsight("Electronic City Flyover", "Bangalore", 68.5, 65.0, new double[]{50, 65, 70, 75, 75, 70, 55}));
        insights.add(createMockInsight("Hebbal Flyover", "Bangalore", 85.0, 80.0, new double[]{75, 80, 85, 85, 90, 85, 75}));
        insights.add(createMockInsight("Marathahalli Bridge", "Bangalore", 88.0, 85.0, new double[]{80, 82, 88, 90, 92, 88, 80}));
        insights.add(createMockInsight("BTM Layout Ring Road", "Bangalore", 76.0, 72.0, new double[]{65, 70, 75, 80, 85, 80, 65}));

        insights.sort((a, b) -> Double.compare((Double) b.get("thisWeekAvg"), (Double) a.get("thisWeekAvg")));
        
        return ResponseEntity.ok(insights);
    }

    private Map<String, Object> createMockInsight(String name, String city, double thisWeek, double lastWeek, double[] dailyData) {
        Map<String, Object> map = new HashMap<>();
        map.put("corridor", name);
        map.put("city", city);
        map.put("thisWeekAvg", thisWeek);
        map.put("lastWeekAvg", lastWeek);
        map.put("weeklyTrend", dailyData);
        return map;
    }
}
