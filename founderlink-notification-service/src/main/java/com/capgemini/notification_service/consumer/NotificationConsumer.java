package com.capgemini.notification_service.consumer;

import java.time.LocalDateTime;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.capgemini.notification_service.dto.NotificationEvent;
import com.capgemini.notification_service.entity.Notification;
import com.capgemini.notification_service.repository.NotificationRepository;
import com.capgemini.notification_service.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository repository;
    
    private final EmailService emailService;

    @RabbitListener(queues = "notification.queue")
    public void consume(NotificationEvent event) {
    	
    	log.info("Received notification event for email: {}", event.getEmail());
    	
    	if (event.getEmail() == null || event.getEmail().isEmpty()) {
    	    log.warn("Skipping email: user email is missing");
    	    return;
    	}

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .userEmail(event.getEmail())
                .message(event.getMessage())
                .type(event.getType())
                .isRead(false)
                .status("CREATED")
                .createdAt(LocalDateTime.now())
                .emailSent(false)
                .build();

        Notification saved = repository.save(notification);

        try {
            emailService.sendNotificationEmail(saved);
        } catch (Exception e) {
        	log.error("Email sending failed for {}", event.getEmail(), e);
        } // EMAIL SENT HERE
    }
}