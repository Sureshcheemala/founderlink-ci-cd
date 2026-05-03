package com.founderlink.auth_service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class RefreshRequest {
    private String refreshToken;
}
