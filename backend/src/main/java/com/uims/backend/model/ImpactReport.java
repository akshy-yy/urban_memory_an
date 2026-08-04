package com.uims.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImpactReport {
    private Integer impactScore; // 0-100 (Higher is worse)
    private String trafficIncrease;
    private String expectedDelay;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String recommendation;
    private List<String> conflicts;
}
