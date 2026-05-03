package com.capgemini.notification_service.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.capgemini.notification_service.entity.Notification;
import com.capgemini.notification_service.service.EmailService;
import com.capgemini.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;
    
    private final EmailService emailService;

    // Get all notifications for a user
    @GetMapping()
    @PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER')")
    public List<Notification> getNotifications(Authentication authentication) {
        return service.getNotificationsByEmail(authentication.getName());
    }

    // Mark notification as read
    @PutMapping("/read/{id}")
    @PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER')")
    public String markAsRead(@PathVariable("id") Long id, Authentication authentication) {
        service.markAsRead(id, authentication.getName());
        return "Notification marked as read";
    }
    
    @GetMapping("/test-email")
    public String testEmail() {
        Notification n = new Notification();
        n.setUserEmail("cheemalasuresh220@gmail.com");
        n.setMessage("Test Email from FounderLink");

        emailService.sendNotificationEmail(n);
        return "Triggered";
    }
}
