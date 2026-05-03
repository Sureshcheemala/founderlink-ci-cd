package com.capgemini.user_service.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.capgemini.user_service.dto.NotificationEvent;
import com.capgemini.user_service.entity.UserProfile;
import com.capgemini.user_service.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationConsumer {

    private final UserProfileRepository repository;

    @RabbitListener(queues = "user.registration.queue")
    @Transactional
    public void handleUserRegistration(NotificationEvent event) {
        if ("USER_REGISTERED".equals(event.getType())) {
            log.info("Received USER_REGISTERED event for email: {}. Seeding user profile.", event.getEmail());
            
            repository.findByEmail(event.getEmail()).ifPresentOrElse(
                profile -> {
                    profile.setRole(event.getRole());
                    repository.save(profile);
                },
                () -> {
                    UserProfile profile = UserProfile.builder()
                            .email(event.getEmail())
                            .role(event.getRole())
                            .build();
                    repository.save(profile);
                }
            );
        }
    }
}
