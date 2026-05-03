package com.capgemini.user_service.service;

import com.capgemini.user_service.config.RabbitMQConstants;
import com.capgemini.user_service.dto.NotificationEvent;
import com.capgemini.user_service.dto.UserProfileRequest;
import com.capgemini.user_service.entity.UserProfile;
import com.capgemini.user_service.exception.ResourceNotFoundException;
import com.capgemini.user_service.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserProfileRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private UserServiceImpl userService;

    private UserProfile profile;
    private UserProfileRequest request;
    private String email = "test@test.com";

    @BeforeEach
    void setUp() {
        profile = UserProfile.builder()
                .id(1L)
                .email(email)
                .name("John Doe")
                .build();

        request = new UserProfileRequest();
        request.setName("John Updated");
        request.setHeadline("Developer");
        request.setLocation("NY");
    }

    @Test
    void createOrUpdateProfile_NewProfile_ShouldCreateAndSendNotification() {
        when(repository.findByEmail(email)).thenReturn(Optional.empty());
        when(repository.save(any(UserProfile.class))).thenAnswer(i -> {
            UserProfile saved = i.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        UserProfile result = userService.createOrUpdateProfile(email, request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Updated", result.getName());
        assertEquals("Developer", result.getHeadline());

        verify(rabbitTemplate, times(1)).convertAndSend(
                eq(RabbitMQConstants.EXCHANGE),
                eq(RabbitMQConstants.ROUTING_KEY),
                any(NotificationEvent.class)
        );
    }

    @Test
    void createOrUpdateProfile_ExistingProfile_ShouldUpdateAndSendNotification() {
        when(repository.findByEmail(email)).thenReturn(Optional.of(profile));
        when(repository.save(any(UserProfile.class))).thenReturn(profile);

        UserProfile result = userService.createOrUpdateProfile(email, request);

        assertNotNull(result);
        assertEquals("John Updated", result.getName());
        
        verify(repository, times(1)).save(profile);
    }

    @Test
    void getProfile_ShouldReturnProfile() {
        when(repository.findByEmail(email)).thenReturn(Optional.of(profile));
        
        UserProfile result = userService.getProfile(email);
        
        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    @Test
    void getProfile_ShouldThrowExceptionWhenNotFound() {
        when(repository.findByEmail(email)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> userService.getProfile(email));
    }

    @Test
    void getAllUsers_ShouldReturnList() {
        when(repository.findAll()).thenReturn(List.of(profile));
        
        List<UserProfile> result = userService.getAllUsers();
        
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getUserById_ShouldReturnUser() {
        when(repository.findById(1L)).thenReturn(Optional.of(profile));
        
        UserProfile result = userService.getUserById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getUserById_ShouldThrowExceptionWhenNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void searchProfiles_ShouldReturnMatchingProfiles() {
        when(repository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrSkillsContainingIgnoreCaseOrLocationContainingIgnoreCase(
                "query", "query", "query", "query"
        )).thenReturn(List.of(profile));

        List<UserProfile> result = userService.searchProfiles("query");

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}
