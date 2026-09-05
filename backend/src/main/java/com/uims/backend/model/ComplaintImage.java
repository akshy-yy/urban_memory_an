package com.uims.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Column(name = "s3_bucket_url")
    private String s3BucketUrl;

    @Column(name = "is_ai_verified")
    private Boolean isAiVerified;

    @Column(name = "is_road_related")
    private Boolean isRoadRelated;

    @Column(name = "road_relevance_confidence")
    private Float roadRelevanceConfidence;

    @Column(name = "urgency_score")
    private Integer urgencyScore;

    @Column(name = "urgency_reasoning", columnDefinition = "TEXT")
    private String urgencyReasoning;

    @Column(name = "suggested_category")
    private String suggestedCategory;

    @Column(name = "ml_model_version")
    private String mlModelVersion;

    @Column(name = "ml_processed_at")
    private String mlProcessedAt;

    @Column(name = "ml_status")
    private String mlStatus;

    @CreationTimestamp
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}
