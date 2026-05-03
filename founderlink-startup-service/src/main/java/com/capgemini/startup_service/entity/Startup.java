package com.capgemini.startup_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String tagline;
    private String description;
    private String industry;
    private String location;
    private String websiteUrl;
    private String linkedinUrl;
    private String logoUrl;
    private String problemStatement;
    private String solution;
    private Double fundingGoal;
    private String stage;
    private Integer teamSize;
    private String foundedDate;
    
    private LocalDateTime createdAt;

    private String founderEmail; // from JWT

    private String status; // PENDING, APPROVED, REJECTED
}