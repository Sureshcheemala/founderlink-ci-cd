package com.founderlink.auth_service.service;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private Role role;
    private String email = "test@test.com";

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setId(1L);
        role.setName("ROLE_FOUNDER");

        user = User.builder()
                .id(1L)
                .email(email)
                .password("encoded_password")
                .name("Test User")
                .isActive(true)
                .roles(Set.of(role))
                .refreshToken("old_refresh_token")
                .build();
    }

    @Test
    void registerUser_ShouldCreateUser() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@test.com");
        req.setName("New User");
        req.setPassword("pass");
        req.setRole("ROLE_FOUNDER");

        when(userRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName("ROLE_FOUNDER")).thenReturn(Optional.of(role));
        when(encoder.encode("pass")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.registerUser(req);

        assertNotNull(response);
        assertEquals("new@test.com", response.getEmail());
        assertEquals("FOUNDER", response.getRole());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void registerUser_ShouldThrowExceptionIfEmailExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> authService.registerUser(req));
    }

    @Test
    void login_ShouldReturnTokens() {
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("password");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(encoder.matches("password", "encoded_password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(email)).thenReturn("new_refresh_token");

        AuthResponse response = authService.login(req);

        assertEquals("access_token", response.getAccessToken());
        assertEquals("new_refresh_token", response.getRefreshToken());
        assertEquals("FOUNDER", response.getRole());
    }

    @Test
    void login_ShouldThrowExceptionForInvalidPassword() {
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("wrong");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(encoder.matches("wrong", "encoded_password")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
    }

    @Test
    void refreshToken_ShouldReturnNewTokens() {
        when(jwtService.validateToken("old_refresh_token")).thenReturn(true);
        when(jwtService.extractUsername("old_refresh_token")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("new_access");
        when(jwtService.generateRefreshToken(email)).thenReturn("new_refresh");

        AuthResponse response = authService.refreshToken("old_refresh_token");

        assertEquals("new_access", response.getAccessToken());
        assertEquals("new_refresh", response.getRefreshToken());
    }

    @Test
    void blockUser_ShouldSetInactive() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        authService.blockUser(1L);

        assertFalse(user.isActive());
        verify(userRepository, times(1)).save(user);
    }
}
