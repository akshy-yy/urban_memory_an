package com.uims.backend.service;

import com.uims.backend.model.ImpactReport;
import com.uims.backend.model.ProjectRequest;
import com.uims.backend.model.Road;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImpactAnalysisService {

    public ImpactReport analyzeImpact(ProjectRequest request, Road road, List<String> existingConflicts) {
        ImpactReport report = new ImpactReport();
        report.setConflicts(existingConflicts);

        int score = 0;
        StringBuilder recommendation = new StringBuilder();

        // Rule 1: Lane Closure Impact
        if (request.getLaneClosurePercentage() > 50) {
            score += 40;
            report.setTrafficIncrease("High");
            report.setExpectedDelay("20-30 mins");
            recommendation.append("Consider reducing lane closure below 50% or working only at night (10 PM - 5 AM). ");
        } else if (request.getLaneClosurePercentage() > 20) {
            score += 20;
            report.setTrafficIncrease("Medium");
            report.setExpectedDelay("10-15 mins");
            recommendation.append("Avoid work during peak hours (8 AM - 10 AM, 5 PM - 8 PM). ");
        } else {
            score += 5;
            report.setTrafficIncrease("Low");
            report.setExpectedDelay("Minimal");
            recommendation.append("Standard traffic management plan required. ");
        }

        // Rule 2: Road Type Impact
        if ("Arterial".equalsIgnoreCase(road.getRoadType())) {
            score += 30;
            recommendation.append("High importance arterial road. Strict diversion planning mandatory. Alternative route recommended via adjacent sub-arterial roads. ");
        } else if ("Sub-arterial".equalsIgnoreCase(road.getRoadType())) {
            score += 15;
        }

        // Rule 3: Existing Conflicts multiplier
        if (!existingConflicts.isEmpty()) {
            score += (existingConflicts.size() * 20);
            recommendation.append("CRITICAL: Existing conflicts found. Coordinate with the other department to merge projects and prevent duplicate digging. ");
        }

        // Cap score
        if (score > 100) score = 100;
        report.setImpactScore(score);

        // Determine Severity
        if (score >= 75) report.setSeverity("CRITICAL");
        else if (score >= 50) report.setSeverity("HIGH");
        else if (score >= 25) report.setSeverity("MEDIUM");
        else report.setSeverity("LOW");

        report.setRecommendation(recommendation.toString().trim());

        return report;
    }
}
