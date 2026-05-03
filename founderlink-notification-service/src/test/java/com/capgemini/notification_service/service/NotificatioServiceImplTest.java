package com.capgemini.notification_service.service;

import com.capgemini.notification_service.entity.Notification;
import com.capgemini.notification_service.exception.ResourceNotFoundException;
import com.capgemini.notification_service.exception.UnauthorizedException;
import com.capgemini.notification_service.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificatioServiceImplTest {

    @Mock
    private NotificationRepository repository;

    @InjectMocks
    private NotificatioServiceImpl notificationService;

    private Notification notification;
    private String email = "test@test.com";

    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setId(1L);
        notification.setUserEmail(email);
        notification.setMessage("Test message");
        notification.setRead(false);
    }

    @Test
    void getNotificationsByEmail_ShouldReturnList() {
        when(repository.findByUserEmail(email)).thenReturn(List.of(notification));
        
        List<Notification> result = notificationService.getNotificationsByEmail(email);
        
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void markAsRead_ShouldUpdateReadStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(notification));
        when(repository.save(any(Notification.class))).thenReturn(notification);

        notificationService.markAsRead(1L, email);

        assertTrue(notification.isRead());
        verify(repository, times(1)).save(notification);
    }

    @Test
    void markAsRead_ShouldThrowUnauthorized() {
        when(repository.findById(1L)).thenReturn(Optional.of(notification));

        assertThrows(UnauthorizedException.class, () -> notificationService.markAsRead(1L, "wrong@test.com"));
    }

    @Test
    void markAsRead_ShouldThrowNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.markAsRead(1L, email));
    }
}
