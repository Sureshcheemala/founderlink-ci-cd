package com.capgemini.startup_service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.capgemini.startup_service.dto.NotificationEvent;
import com.capgemini.startup_service.dto.StartupRequest;
import com.capgemini.startup_service.entity.Startup;
import com.capgemini.startup_service.repository.FollowRepository;
import com.capgemini.startup_service.repository.StartupRepository;
import com.capgemini.startup_service.service.StartupServiceImpl;

@ExtendWith(MockitoExtension.class)
class StartupServiceTest {

    @Mock
    private StartupRepository startupRepository;

    @Mock
    private FollowRepository followRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private StartupServiceImpl startupService;

    @Test
    void testCreateStartup() {

        // Arrange
        StartupRequest request = new StartupRequest();
        request.setName("Test Startup");
        request.setIndustry("FinTech");
        request.setFundingGoal(50000.0);

        Startup savedStartup = new Startup();
        savedStartup.setName("Test Startup");

        when(startupRepository.save(any(Startup.class)))
                .thenReturn(savedStartup);

        // 🔥 IMPORTANT FIX
        doNothing().when(rabbitTemplate)
                .convertAndSend(anyString(), anyString(), any(NotificationEvent.class));

        // Act
        Startup result = startupService.createStartup("test@mail.com", request);

        // Assert
        assertNotNull(result);
        assertEquals("Test Startup", result.getName());

        verify(startupRepository, times(1)).save(any(Startup.class));
        verify(rabbitTemplate, times(1))
                .convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }
}