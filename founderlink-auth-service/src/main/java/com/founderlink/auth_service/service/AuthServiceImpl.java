package com.founderlink.auth_service.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.founderlink.auth_service.config.RabbitMQConstants;
import com.founderlink.auth_service.dto.AuthResponse;
import com.founderlink.auth_service.dto.LoginRequest;
import com.founderlink.auth_service.dto.NotificationEvent;
import com.founderlink.auth_service.dto.RegisterRequest;
import com.founderlink.auth_service.entity.Role;
import com.founderlink.auth_service.entity.User;
import com.founderlink.auth_service.exception.BadRequestException;
import com.founderlink.auth_service.exception.ResourceNotFoundException;
import com.founderlink.auth_service.exception.UnauthorizedException;
import com.founderlink.auth_service.repository.RoleRepository;
import com.founderlink.auth_service.repository.UserRepository;
import com.founderlink.auth_service.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder encoder;
	private final JwtService jwtService;
	private final RabbitTemplate rabbitTemplate;

	@Override
	public AuthResponse registerUser(RegisterRequest registerRequest) {

		// checking if email already exists
		userRepository.findByEmail(registerRequest.getEmail()).ifPresent(user -> {
			throw new BadRequestException("Email already exists");
		});
		
		//Getting role details and checking if it exists
		Role role = roleRepository.findByName(registerRequest.getRole())
				.orElseThrow(() -> new ResourceNotFoundException("Role does not exist"));
		
		//Converting role into set
		Set<Role> roles = Set.of(role);
		
		//creating and save user
		User user = User.builder()
				.name(registerRequest.getName())
				.email(registerRequest.getEmail())
				.password(encoder.encode(registerRequest.getPassword()))
				.createdAt(LocalDateTime.now())
				.roles(roles)
				.build();
		userRepository.save(user);

		NotificationEvent event = new NotificationEvent(
				"USER_REGISTERED",
				user.getEmail(),
				"Welcome to FounderLink, " + user.getName() + "!",
				user.getId(),
				registerRequest.getRole()
		);

		rabbitTemplate.convertAndSend(
				RabbitMQConstants.EXCHANGE,
				RabbitMQConstants.ROUTING_KEY,
				event
		);
		
		return AuthResponse.builder()
		        .email(user.getEmail())
		        .role(role.getName().replace("ROLE_", ""))
		        .message("User registered successfully")
		        .build();
	}

	@Override
	public AuthResponse login(LoginRequest loginRequest) {
		
		//checking if the user exists or not
		User user = userRepository.findByEmail(loginRequest.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("User not Found with the email"));
		
		//checking password match
		if(!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
			throw new UnauthorizedException("Invalid credentials");
		}
		
		if (!user.isActive()) {
		    throw new UnauthorizedException("User account is blocked");
		}
		
		//generating jwt token
		String token = jwtService.generateToken(user);
		String refreshToken = jwtService.generateRefreshToken(user.getEmail());
		
		user.setRefreshToken(refreshToken);
		userRepository.save(user);
		
		// extract role (assuming single role)
		String role = user.getRoles()
		        .stream()
		        .findFirst()
		        .map(Role::getName)
		        .map(r -> r.replace("ROLE_", "")) // 🔥 THIS LINE
		        .orElse("USER");

		return AuthResponse.builder()
		        .accessToken(token)
		        .refreshToken(refreshToken)
		        .email(user.getEmail())
		        .role(role)
		        .message("Login successful")
		        .build();
	}
	
	public AuthResponse refreshToken(String refreshToken) {

        // 1. Validate refresh token
        if (!jwtService.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        // 2. Extract email
        String email = jwtService.extractUsername(refreshToken);

        // 3. Fetch user (IMPORTANT)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
        
     // 4. CHECK if token matches stored one
        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new UnauthorizedException("Refresh token mismatch (possible attack)");
        }

        // 4. Generate new tokens
        String accessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(email);
        
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        String role = user.getRoles()
                .stream()
                .findFirst()
                .map(Role::getName)
                .map(r -> r.replace("ROLE_", "")) // 🔥 THIS LINE
                .orElse("USER");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .role(role)
                .build();
    }
	
	 public void blockUser(Long userId) {

	        User user = userRepository.findById(userId)
	            .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

	        user.setActive(false);

	        userRepository.save(user);
	    }
}
