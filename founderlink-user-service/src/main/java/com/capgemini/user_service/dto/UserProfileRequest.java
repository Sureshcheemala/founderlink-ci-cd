package com.capgemini.user_service.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String headline;
    private String location;
    private String bio;
    private String skills;
    private String experience;
    private String linkedinUrl;
    private String avatarUrl;
    private String portfolioLinks;

}