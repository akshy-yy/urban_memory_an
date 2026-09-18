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

        // ── Rule 1: Lane Closure Impact ────────────────────────────────
        String laneClosureDetail;
        if (request.getLaneClosurePercentage() > 50) {
            score += 40;
            report.setTrafficIncrease("High");
            report.setExpectedDelay("20-30 mins");
            recommendation.append("Consider reducing lane closure below 50% or working only at night (10 PM - 5 AM). ");
            laneClosureDetail = request.getLaneClosurePercentage() + "% lane closure (High impact — night-only work advised)";
        } else if (request.getLaneClosurePercentage() > 20) {
            score += 20;
            report.setTrafficIncrease("Medium");
            report.setExpectedDelay("10-15 mins");
            recommendation.append("Avoid work during peak hours (8 AM - 10 AM, 5 PM - 8 PM). ");
            laneClosureDetail = request.getLaneClosurePercentage() + "% lane closure (Medium impact — avoid peak hours)";
        } else {
            score += 5;
            report.setTrafficIncrease("Low");
            report.setExpectedDelay("Minimal");
            recommendation.append("Standard traffic management plan required. ");
            laneClosureDetail = request.getLaneClosurePercentage() + "% lane closure (Low impact)";
        }

        // ── Rule 2: Road Type Impact ────────────────────────────────────
        String roadTypeDetail;
        if ("Arterial".equalsIgnoreCase(road.getRoadType())) {
            score += 30;
            recommendation.append("High importance arterial road. Strict diversion planning mandatory. Alternative route recommended via adjacent sub-arterial roads. ");
            roadTypeDetail = "road type is Arterial (high importance — strict diversion required)";
        } else if ("Sub-arterial".equalsIgnoreCase(road.getRoadType())) {
            score += 15;
            roadTypeDetail = "road type is Sub-arterial (moderate importance)";
        } else {
            roadTypeDetail = "road type is " + (road.getRoadType() != null ? road.getRoadType() : "Local") + " (standard management applies)";
        }

        // ── Rule 3: Existing Conflicts multiplier ───────────────────────
        String conflictDetail;
        if (!existingConflicts.isEmpty()) {
            score += (existingConflicts.size() * 20);
            recommendation.append("CRITICAL: Existing conflicts found. Coordinate with the other department to merge projects and prevent duplicate digging. ");
            conflictDetail = existingConflicts.size() + " scheduling conflict(s) detected — inter-department coordination required";
        } else {
            conflictDetail = "no scheduling conflicts detected";
        }

        // ── Cap score ───────────────────────────────────────────────────
        if (score > 100) score = 100;
        report.setImpactScore(score);

        // ── Determine Severity ──────────────────────────────────────────
        if (score >= 75) report.setSeverity("CRITICAL");
        else if (score >= 50) report.setSeverity("HIGH");
        else if (score >= 25) report.setSeverity("MEDIUM");
        else report.setSeverity("LOW");

        report.setRecommendation(recommendation.toString().trim());

        // ── Recommended work window fragment ────────────────────────────
        String windowDetail = buildWindowDetail(request);

        // ── Build plain-English Approval Receipt ────────────────────────
        String receipt = buildApprovalReceipt(
                report.getSeverity(), laneClosureDetail, roadTypeDetail,
                conflictDetail, windowDetail, score);
        report.setApprovalReceipt(receipt);

        return report;
    }

    // ────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────

    /**
     * Builds a plain-English approval receipt that explains the scoring outcome.
     *
     * <p>Examples:
     * <ul>
     *   <li><em>"Approved because lane closure is 20% (Low impact), road type is Local
     *       (standard management applies), no scheduling conflicts detected, and the
     *       recommended work window is Tuesday 02:00–05:00. Impact score: 5/100 (LOW)."</em></li>
     *   <li><em>"Flagged for review because lane closure is 60% (High impact — night-only
     *       work advised), road type is Arterial (high importance — strict diversion
     *       required), 2 scheduling conflict(s) detected — inter-department coordination
     *       required, and the recommended work window is Saturday 23:00–04:00.
     *       Impact score: 100/100 (CRITICAL)."</em></li>
     * </ul>
     */
    private String buildApprovalReceipt(String severity, String laneDetail,
                                        String roadDetail, String conflictDetail,
                                        String windowDetail, int score) {
        String verdict = (severity.equals("CRITICAL") || severity.equals("HIGH"))
                ? "Flagged for review"
                : "Approved";

        return String.format(
                "%s because %s, %s, %s, and %s. Impact score: %d/100 (%s).",
                verdict, laneDetail, roadDetail, conflictDetail, windowDetail, score, severity);
    }

    /**
     * Produces a human-readable recommended work-window string.
     * Falls back gracefully when no window has been provided by the caller.
     */
    private String buildWindowDetail(ProjectRequest request) {
        if (request.getRecommendedStartTime() != null && request.getRecommendedEndTime() != null) {
            // Parse ISO-like strings (spaces accepted in addition to 'T')
            String start = request.getRecommendedStartTime().replace("T", " ");
            String end = request.getRecommendedEndTime().replace("T", " ");
            return "the recommended work window is " + start + " to " + end;
        }
        // Derive a sensible default from lane closure percentage
        if (request.getLaneClosurePercentage() != null && request.getLaneClosurePercentage() > 50) {
            return "the recommended work window is nightly 22:00–05:00 (night-only restriction)";
        }
        return "no specific work window has been pre-scheduled";
    }
}

