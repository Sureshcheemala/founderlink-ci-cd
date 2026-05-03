package com.capgemini.team_service.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.capgemini.team_service.dto.NotificationEvent;
import com.capgemini.team_service.repository.TeamRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TeamCleanupConsumer {

    private final TeamRepository repository;

    @RabbitListener(queues = "team.cleanup.queue")
    @Transactional
    public void handleStartupDeleted(NotificationEvent event) {
        if ("STARTUP_DELETED".equals(event.getType())) {
            log.info("Received STARTUP_DELETED event for startup ID: {}. Cleaning up team records.", event.getUserId());
            repository.deleteByStartupId(event.getUserId());
        }
    }
}
