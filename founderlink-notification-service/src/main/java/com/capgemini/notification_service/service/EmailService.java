package com.capgemini.notification_service.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.capgemini.notification_service.entity.Notification;
import com.capgemini.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationRepository repository;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Async
    public void sendNotificationEmail(Notification notification) {

        try {
            // ✅ Basic validation
            if (notification.getUserEmail() == null || notification.getUserEmail().isEmpty()) {
                throw new IllegalArgumentException("User email is missing");
            }

            log.info("Mail username (from config): {}", fromEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // ✅ FIXED
            message.setTo(notification.getUserEmail());
            message.setSubject("New Notification - FounderLink");

            message.setText(
                    "Hello,\n\n" +
                    "You have a new notification:\n\n" +
                    notification.getMessage() +
                    "\n\nCheck it in your dashboard.\n\n" +
                    "Regards,\nFounderLink Team"
            );

            mailSender.send(message);

            // ✅ Success handling
            notification.setEmailSent(true);
            notification.setEmailSentAt(LocalDateTime.now());
            notification.setStatus("SENT");

            log.info("Email sent successfully to {}", notification.getUserEmail());

        } catch (Exception e) {

            // ✅ Proper logging (NO printStackTrace)
            log.error("Failed to send email to {}: {}", 
                      notification.getUserEmail(), e.getMessage(), e);

            // ✅ Failure handling
            notification.setEmailSent(false);
            notification.setEmailSentAt(LocalDateTime.now());
            notification.setStatus("FAILED");
        }

        repository.save(notification);
    }
}