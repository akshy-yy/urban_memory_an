package com.uims.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotBlank
    private String category;
    
    @NotBlank
    private String description;

    @NotNull
    private Long roadId;

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;

    private Boolean isRoadRelated;
    private Float roadRelevanceConfidence;
    private Integer urgencyScore;
    private String urgencyReasoning;
    private String suggestedCategory;
    private String mlModelVersion;
    private String mlProcessedAt;
    private String mlStatus;
}
