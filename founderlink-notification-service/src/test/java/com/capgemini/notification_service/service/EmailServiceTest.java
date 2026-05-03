package com.capgemini.notification_service.service;

import com.capgemini.notification_service.entity.Notification;
import com.capgemini.notification_service.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private NotificationRepository repository;

    @InjectMocks
    private EmailService emailService;

    private Notification notification;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@founderlink.com");
        
        notification = new Notification();
        notification.setId(1L);
        notification.setUserEmail("test@test.com");
        notification.setMessage("Test message");
    }

    @Test
    void sendNotificationEmail_ShouldSendSuccessfully() {
        emailService.sendNotificationEmail(notification);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
        verify(repository, times(1)).save(notification);
        assertTrue(notification.isEmailSent());
        assertEquals("SENT", notification.getStatus());
    }

    @Test
    void sendNotificationEmail_ShouldHandleFailure() {
        doThrow(new RuntimeException("Mail server down")).when(mailSender).send(any(SimpleMailMessage.class));

        emailService.sendNotificationEmail(notification);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
        verify(repository, times(1)).save(notification);
        assertFalse(notification.isEmailSent());
        assertEquals("FAILED", notification.getStatus());
    }

    @Test
    void sendNotificationEmail_ShouldFailIfEmailIsMissing() {
        notification.setUserEmail(null);

        emailService.sendNotificationEmail(notification);

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        verify(repository, times(1)).save(notification);
        assertFalse(notification.isEmailSent());
        assertEquals("FAILED", notification.getStatus());
    }
}
