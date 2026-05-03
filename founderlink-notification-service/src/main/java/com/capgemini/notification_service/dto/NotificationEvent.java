package com.capgemini.notification_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    private String type;      // USER_CREATED, INVESTMENT_ACCEPTED
    private String email;     // receiver
    private String message;   // message
    private Long userId;
    private String role;
}
