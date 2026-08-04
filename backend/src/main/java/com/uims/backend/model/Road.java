package com.uims.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString;

@Entity
@Table(name = "roads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Road {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String ward;
    private String zone;

    private Double lengthInKm;

    @Column(name = "road_type")
    private String roadType; // e.g., Arterial, Sub-arterial, Local

    @Column(name = "health_score")
    private Integer healthScore; // 0-100

    @Column(columnDefinition = "geometry")
    private LineString geometry;
}
