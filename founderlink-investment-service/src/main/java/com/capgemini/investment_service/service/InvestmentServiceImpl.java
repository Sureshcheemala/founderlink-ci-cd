package com.capgemini.investment_service.service;

import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.capgemini.investment_service.config.RabbitMQConstants;
import com.capgemini.investment_service.dto.FundingRequest;
import com.capgemini.investment_service.dto.InvestmentRequest;
import com.capgemini.investment_service.dto.NotificationEvent;
import com.capgemini.investment_service.dto.StartupResponse;
import com.capgemini.investment_service.entity.InitiatorType;
import com.capgemini.investment_service.entity.Investment;
import com.capgemini.investment_service.entity.InvestmentStatus;
import com.capgemini.investment_service.exception.BadRequestException;
import com.capgemini.investment_service.exception.ResourceNotFoundException;
import com.capgemini.investment_service.exception.UnauthorizedException;
import com.capgemini.investment_service.feign.StartupClient;
import com.capgemini.investment_service.repository.InvestmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvestmentRepository repository;
    
    private final RabbitTemplate rabbitTemplate;
    
    private final StartupClient startupClient;

    public Investment createInvestment(String investorEmail, InvestmentRequest request) {
    	
    	String founderEmail = getFounderEmailFromStartup(request.getStartupId());
    	
    	boolean exists = repository.existsByStartupIdAndInvestorEmail(
    	        request.getStartupId(), investorEmail);

    	if (exists) {
    	    throw new BadRequestException("Already invested in this startup");
    	}

        Investment investment = Investment.builder()
                .startupId(request.getStartupId())
                .investorEmail(investorEmail)
                .founderEmail(founderEmail)
                .amount(request.getAmount())
                .initiatedBy(InitiatorType.INVESTOR)
                .status(InvestmentStatus.PENDING)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        Investment saved = repository.save(investment);

        sendEvent("INVESTMENT_CREATED", founderEmail,
                "New investment of ₹ " + request.getAmount() + " has been created", saved.getId());
        
        return saved;
    }
    
    public Investment approveInvestment(Long id, String founderEmail) {

        Investment investment = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Investment not found"));

        if (!investment.getFounderEmail().equals(founderEmail)) {
            throw new UnauthorizedException("Not allowed");
        }

        if (investment.getStatus() != InvestmentStatus.PENDING) {
            throw new BadRequestException("Only PENDING investments can be approved");
        }

        investment.setStatus(InvestmentStatus.APPROVED);

        Investment saved = repository.save(investment);

        sendEvent("INVESTMENT_APPROVED", investment.getInvestorEmail(),
                "Investment approved for ₹ " + investment.getAmount(), saved.getId());


        return saved;
    }
    
    public Investment rejectInvestment(Long id, String founderEmail) {

        Investment investment = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Investment not found"));

        if (investment.getStatus() != InvestmentStatus.PENDING) {
            throw new BadRequestException("Only PENDING investments can be rejected");
        }

        investment.setStatus(InvestmentStatus.REJECTED);
        
        Investment saved = repository.save(investment);
        
        sendEvent("INVESTMENT_REJECTED", investment.getInvestorEmail(),
                "Investment rejected for ₹ " + investment.getAmount(), saved.getId());

        return saved;
    }

    public List<Investment> getByStartup(Long startupId, String email) {
        validateFounderAccess(startupId, email);
        return repository.findByStartupId(startupId);
    }

    public List<Investment> getByInvestor(String email) {
        return repository.findByInvestorEmail(email);
    }
    
    public List<Investment> getPendingRequests(String email) {
        return repository.findByInvestorEmailAndStatusAndInitiatedBy(
            email, InvestmentStatus.REQUESTED, InitiatorType.FOUNDER
        );
    }
    
    public List<Investment> getRequests(String email) {
        return repository.findByInvestorEmailOrFounderEmail(email, email);
    }
    
    public Investment requestInvestment(String founderEmail, FundingRequest fundingRequest) {

        Investment investment = Investment.builder()
        		.startupId(fundingRequest.getStartupId())
                .investorEmail(fundingRequest.getInvestorEmail()) // important
                .founderEmail(founderEmail)
                .amount(fundingRequest.getAmount())
                .initiatedBy(InitiatorType.FOUNDER)
                .status(InvestmentStatus.REQUESTED)
                .build();
        
        Investment saved = repository.save(investment);
        
        sendEvent("INVESTMENT_REQUEST", investment.getInvestorEmail(),
                "Investment Requested for ₹ " + fundingRequest.getAmount(), saved.getId());

        return saved;
    }
    
    public Investment acceptRequest(Long id, String investorEmail) {

        Investment investment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

        if (!investment.getInvestorEmail().equals(investorEmail)) {
            throw new UnauthorizedException("Not allowed");
        }
        
        if (investment.getStatus() != InvestmentStatus.REQUESTED) {
            throw new BadRequestException("Only REQUESTED investments can be accepted/rejected");
        }
        
        investment.setStatus(InvestmentStatus.APPROVED);
        
        Investment saved = repository.save(investment);
        
        sendEvent("INVESTMENT_ACCEPTED", investment.getFounderEmail(),
                "Investment accepted for ₹ " + investment.getAmount(), saved.getId());

        return saved;
    }
    
    public Investment rejectRequest(Long id, String investorEmail) {

        Investment investment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));
        
        if (!investment.getInvestorEmail().equals(investorEmail)) {
            throw new UnauthorizedException("Not allowed");
        }
        
        if (investment.getStatus() != InvestmentStatus.REQUESTED) {
            throw new BadRequestException("Only REQUESTED investments can be accepted/rejected");
        }
        
        investment.setStatus(InvestmentStatus.REJECTED);
        
        Investment saved = repository.save(investment);
        
        sendEvent("INVESTMENT_REJECTED", investment.getFounderEmail(),
                "Investment rejected for ₹ " + investment.getAmount(), saved.getId());

        return saved;
    }
    

    
    private void sendEvent(String type, String email, String message, Long id) {
        NotificationEvent event = new NotificationEvent(type, email, message, id, null);

        rabbitTemplate.convertAndSend(
                RabbitMQConstants.EXCHANGE,
                RabbitMQConstants.ROUTING_KEY,
                event
        );
    }
    
    private String getFounderEmailFromStartup(Long startupId) {
        StartupResponse startup = startupClient.getStartupById(startupId);
        if (startup == null) {
            throw new ResourceNotFoundException("Startup not found");
        }
        return startup.getFounderEmail();
    }
    
    private void validateFounderAccess(Long startupId, String email) {
        String founderEmail = getFounderEmailFromStartup(startupId);

        if (!founderEmail.equals(email)) {
            throw new UnauthorizedException("Not allowed");
        }
    }

    @Override
    public Double getTotalApprovedFunding(Long startupId) {
        return repository.sumApprovedAmountByStartupId(startupId);
    }


}
