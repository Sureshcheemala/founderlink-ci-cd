package com.capgemini.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email; // comes from JWT

    private String name;
    private String headline;
    private String location;
    private String bio;
    private String skills;
    private String experience;
    private String linkedinUrl;
    private String avatarUrl;
    private String portfolioLinks;
    private String role;
}