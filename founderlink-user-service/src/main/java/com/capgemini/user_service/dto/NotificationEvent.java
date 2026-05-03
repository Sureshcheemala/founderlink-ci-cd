package com.capgemini.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    private String type;
    private String email;
    private String message;
    private Long userId;
    private String role;
}
