package com.capgemini.notification_service.service;

import java.util.List;

import com.capgemini.notification_service.entity.Notification;

public interface NotificationService {

	List<Notification> getNotificationsByEmail(String email);
	
	void markAsRead(Long id, String email);
}
