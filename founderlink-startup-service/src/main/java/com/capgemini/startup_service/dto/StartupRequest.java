package com.capgemini.startup_service.dto;

import lombok.Data;

@Data
public class StartupRequest {
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
}