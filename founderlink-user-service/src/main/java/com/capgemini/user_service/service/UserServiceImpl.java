package com.capgemini.user_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.capgemini.user_service.config.RabbitMQConstants;
import com.capgemini.user_service.dto.NotificationEvent;
import com.capgemini.user_service.dto.UserProfileRequest;
import com.capgemini.user_service.entity.UserProfile;
import com.capgemini.user_service.repository.UserProfileRepository;
import com.capgemini.user_service.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserProfileRepository repository;
    
    private final RabbitTemplate rabbitTemplate;

    @Override
    public UserProfile createOrUpdateProfile(String email, UserProfileRequest request) {

        UserProfile profile = repository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Creating new profile for email: {}", email);
                    return UserProfile.builder().email(email).build();
                });

        profile.setName(request.getName());
        profile.setHeadline(request.getHeadline());
        profile.setLocation(request.getLocation());
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setPortfolioLinks(request.getPortfolioLinks());

        UserProfile savedProfile = repository.save(profile);

        NotificationEvent event = new NotificationEvent(
                "USERPROFILE_CREATED/UPDATED",
                email,
                "Saved profile details for the user " + savedProfile.getName(),
                savedProfile.getId(),
                null
        );
        
        rabbitTemplate.convertAndSend(
                RabbitMQConstants.EXCHANGE,
                RabbitMQConstants.ROUTING_KEY,
                event
        );

        return savedProfile;
    }

    @Override
    public UserProfile getProfile(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for email: " + email));
    }
    
    @Override
    public List<UserProfile> getAllUsers() {
        return repository.findAll();
    }
    
    @Override
    public UserProfile getUserById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public List<UserProfile> searchProfiles(String query) {
        return repository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrSkillsContainingIgnoreCaseOrLocationContainingIgnoreCase(
            query, query, query, query
        );
    }
}