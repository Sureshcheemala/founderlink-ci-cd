package com.founderlink.auth_service.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String message;
    
    private String email;
    private String role;
}
