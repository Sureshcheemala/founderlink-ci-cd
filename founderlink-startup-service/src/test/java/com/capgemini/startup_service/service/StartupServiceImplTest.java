package com.capgemini.startup_service.service;

import com.capgemini.startup_service.config.RabbitMQConstants;
import com.capgemini.startup_service.dto.NotificationEvent;
import com.capgemini.startup_service.dto.StartupRequest;
import com.capgemini.startup_service.entity.Follow;
import com.capgemini.startup_service.entity.Startup;
import com.capgemini.startup_service.exception.ConflictException;
import com.capgemini.startup_service.exception.ResourceNotFoundException;
import com.capgemini.startup_service.exception.UnauthorizedException;
import com.capgemini.startup_service.repository.FollowRepository;
import com.capgemini.startup_service.repository.StartupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StartupServiceImplTest {

    @Mock
    private StartupRepository repository;

    @Mock
    private FollowRepository followRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private StartupServiceImpl startupService;

    private Startup startup;
    private StartupRequest request;
    private String email = "test@founder.com";

    @BeforeEach
    void setUp() {
        startup = Startup.builder()
                .id(1L)
                .founderEmail(email)
                .name("TechNova")
                .status("PENDING")
                .build();

        request = new StartupRequest();
        request.setName("TechNova updated");
        request.setDescription("Desc");
    }

    @Test
    void createStartup_ShouldCreateAndSendNotification() {
        when(repository.save(any(Startup.class))).thenAnswer(i -> {
            Startup s = i.getArgument(0);
            s.setId(1L);
            return s;
        });

        Startup result = startupService.createStartup(email, request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("TechNova updated", result.getName());
        assertEquals("PENDING", result.getStatus());

        verify(rabbitTemplate, times(1)).convertAndSend(
                eq(RabbitMQConstants.EXCHANGE),
                eq(RabbitMQConstants.ROUTING_KEY),
                any(NotificationEvent.class)
        );
    }

    @Test
    void updateStartup_ShouldUpdateStartup() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(repository.save(any(Startup.class))).thenReturn(startup);

        Startup result = startupService.updateStartup(1L, email, request);

        assertNotNull(result);
        assertEquals("TechNova updated", result.getName());
    }

    @Test
    void updateStartup_ShouldThrowUnauthorized() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        
        assertThrows(UnauthorizedException.class, () -> startupService.updateStartup(1L, "wrong@email.com", request));
    }

    @Test
    void getStartups_ShouldReturnPage() {
        Page<Startup> page = new PageImpl<>(List.of(startup));
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Startup> result = startupService.getStartups("Tech", "IT", "Seed", 1000.0, 50000.0, "createdAt", "desc", email, false, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getMyStartups_ShouldReturnList() {
        when(repository.findByFounderEmail(email)).thenReturn(List.of(startup));

        List<Startup> result = startupService.getMyStartups(email);

        assertFalse(result.isEmpty());
    }

    @Test
    void getStartupById_ShouldReturnStartup() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));

        Startup result = startupService.getStartupById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void approve_ShouldUpdateStatusAndSendNotification() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(repository.save(any(Startup.class))).thenReturn(startup);

        Startup result = startupService.approve(1L, "admin@test.com");

        assertEquals("APPROVED", result.getStatus());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void reject_ShouldUpdateStatusAndSendNotification() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(repository.save(any(Startup.class))).thenReturn(startup);

        Startup result = startupService.reject(1L, "admin@test.com");

        assertEquals("REJECTED", result.getStatus());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void followStartup_ShouldCreateFollow() {
        when(followRepository.existsByStartupIdAndEmail(1L, email)).thenReturn(false);

        startupService.followStartup(1L, email);

        verify(followRepository, times(1)).save(any(Follow.class));
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void followStartup_ShouldThrowConflict() {
        when(followRepository.existsByStartupIdAndEmail(1L, email)).thenReturn(true);

        assertThrows(ConflictException.class, () -> startupService.followStartup(1L, email));
    }

    @Test
    void getFollowedStartupIds_ShouldReturnList() {
        Follow f = new Follow();
        f.setStartupId(1L);
        when(followRepository.findByEmail(email)).thenReturn(List.of(f));

        List<Long> result = startupService.getFollowedStartupIds(email);

        assertFalse(result.isEmpty());
        assertEquals(1L, result.get(0));
    }

    @Test
    void deleteStartup_ShouldDeleteAndSendNotification() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));

        startupService.deleteStartup(1L, email);

        verify(repository, times(1)).delete(startup);
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }
}
