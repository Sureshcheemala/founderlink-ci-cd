package com.capgemini.startup_service.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.capgemini.startup_service.dto.NotificationEvent;
import com.capgemini.startup_service.entity.Startup;
import com.capgemini.startup_service.repository.StartupRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TeamEventConsumer {

    private final StartupRepository repository;

    @RabbitListener(queues = "startup.team.sync.queue")
    @Transactional
    public void handleTeamEvent(NotificationEvent event) {
        if ("TEAM_MEMBER_ADDED".equals(event.getType())) {
            log.info("Received TEAM_MEMBER_ADDED event. Syncing team size for startup id: {}", event.getUserId());
            
            repository.findById(event.getUserId()).ifPresent(startup -> {
                int currentSize = startup.getTeamSize() != null ? startup.getTeamSize() : 0;
                startup.setTeamSize(currentSize + 1);
                repository.save(startup);
                log.info("Incremented team size for startup: {}", startup.getName());
            });
        }
    }
}
