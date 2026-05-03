package com.capgemini.user_service.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capgemini.user_service.entity.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByEmail(String email);

    java.util.List<UserProfile> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrSkillsContainingIgnoreCaseOrLocationContainingIgnoreCase(
        String name, String email, String skills, String location
    );
}