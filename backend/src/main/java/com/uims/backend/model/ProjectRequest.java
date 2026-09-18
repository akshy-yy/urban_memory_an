package com.uims.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String workType;

    @NotNull
    private Long roadId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    private Integer laneClosurePercentage;

    private String recommendedStartTime;
    private String recommendedEndTime;
    private Integer disruptionScoreAtApproval;
}
