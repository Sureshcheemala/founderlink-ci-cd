package com.capgemini.investment_service.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.capgemini.investment_service.dto.NotificationEvent;
import com.capgemini.investment_service.repository.InvestmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentCleanupConsumer {

    private final InvestmentRepository repository;

    @RabbitListener(queues = "investment.cleanup.queue")
    @Transactional
    public void handleStartupDeleted(NotificationEvent event) {
        if ("STARTUP_DELETED".equals(event.getType())) {
            log.info("Received STARTUP_DELETED event for startup ID: {}. Cleaning up investment records.", event.getUserId());
            repository.deleteByStartupId(event.getUserId());
        }
    }
}
