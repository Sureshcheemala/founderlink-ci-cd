package com.founderlink.auth_service.service;

import com.founderlink.auth_service.dto.AuthResponse;
import com.founderlink.auth_service.dto.LoginRequest;
import com.founderlink.auth_service.dto.RegisterRequest;

public interface AuthService {
	AuthResponse registerUser(RegisterRequest registerRequest);
	
	AuthResponse login(LoginRequest loginRequest);
	
	AuthResponse refreshToken(String refreshToken);
	
	public void blockUser(Long userId);
}
