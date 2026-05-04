package com.founderlink.auth_service.config;

import com.founderlink.auth_service.entity.Role;
import com.founderlink.auth_service.entity.User;
import com.founderlink.auth_service.repository.RoleRepository;
import com.founderlink.auth_service.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RoleInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @PostConstruct
    public void init() {

        Role adminRole = createIfNotExists("ROLE_ADMIN");
        createIfNotExists("ROLE_FOUNDER");
        createIfNotExists("ROLE_COFOUNDER");
        createIfNotExists("ROLE_INVESTOR");

        // 🔥 Create default admin user
        if (userRepository.findByEmail("admin@founderlink.com").isEmpty()) {

            User admin = User.builder()
                    .name("Suresh")
                    .email("chnvss.719@gmail.com")
                    .password(encoder.encode("suresh"))
                    .roles(Set.of(adminRole))
                    .isActive(true)
                    .build();

            userRepository.save(admin);
        }
    }

    private Role createIfNotExists(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(roleName).build()
                ));
    }
}