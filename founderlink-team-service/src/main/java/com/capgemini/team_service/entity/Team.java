package com.capgemini.team_service.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    indexes = {
        @Index(name = "idx_startup_id", columnList = "startupId"),
        @Index(name = "idx_user_email", columnList = "userEmail")
    }
)
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long startupId;

    @Column(nullable = false, length = 100)
    private String startupName;

    @Column(nullable = false, length = 100)
    private String userEmail;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false, length = 20)
    private String type; // INVITE, REQUEST

    @Column(nullable = false, length = 20)
    private String status; // INVITED, REQUESTED, ACCEPTED, REJECTED

    @Column(nullable = false, length = 100)
    private String invitedBy;

    @CreationTimestamp
    private LocalDateTime createdAt;
}