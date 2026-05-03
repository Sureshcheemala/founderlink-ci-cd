package com.capgemini.investment_service.service;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvestmentServiceImplTest {

    @Mock
    private InvestmentRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private StartupClient startupClient;

    @InjectMocks
    private InvestmentServiceImpl investmentService;

    private Investment investment;
    private StartupResponse startup;
    private String founderEmail = "founder@test.com";
    private String investorEmail = "investor@test.com";

    @BeforeEach
    void setUp() {
        investment = Investment.builder()
                .id(1L)
                .startupId(1L)
                .investorEmail(investorEmail)
                .founderEmail(founderEmail)
                .amount(10000.0)
                .initiatedBy(InitiatorType.INVESTOR)
                .status(InvestmentStatus.PENDING)
                .build();

        startup = new StartupResponse();
        startup.setId(1L);
        startup.setFounderEmail(founderEmail);
    }

    @Test
    void createInvestment_ShouldCreate() {
        InvestmentRequest req = new InvestmentRequest();
        req.setStartupId(1L);
        req.setAmount(10000.0);

        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.existsByStartupIdAndInvestorEmail(1L, investorEmail)).thenReturn(false);
        when(repository.save(any(Investment.class))).thenReturn(investment);

        Investment result = investmentService.createInvestment(investorEmail, req);

        assertNotNull(result);
        assertEquals(InvestmentStatus.PENDING, result.getStatus());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void createInvestment_ShouldThrowBadRequestIfAlreadyInvested() {
        InvestmentRequest req = new InvestmentRequest();
        req.setStartupId(1L);
        
        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.existsByStartupIdAndInvestorEmail(1L, investorEmail)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> investmentService.createInvestment(investorEmail, req));
    }

    @Test
    void approveInvestment_ShouldApprove() {
        when(repository.findById(1L)).thenReturn(Optional.of(investment));
        when(repository.save(any(Investment.class))).thenReturn(investment);

        Investment result = investmentService.approveInvestment(1L, founderEmail);

        assertEquals(InvestmentStatus.APPROVED, result.getStatus());
    }

    @Test
    void approveInvestment_ShouldThrowUnauthorized() {
        when(repository.findById(1L)).thenReturn(Optional.of(investment));

        assertThrows(UnauthorizedException.class, () -> investmentService.approveInvestment(1L, "wrong@test.com"));
    }

    @Test
    void rejectInvestment_ShouldReject() {
        when(repository.findById(1L)).thenReturn(Optional.of(investment));
        when(repository.save(any(Investment.class))).thenReturn(investment);

        Investment result = investmentService.rejectInvestment(1L, founderEmail);

        assertEquals(InvestmentStatus.REJECTED, result.getStatus());
    }

    @Test
    void requestInvestment_ShouldCreateRequest() {
        FundingRequest req = new FundingRequest();
        req.setStartupId(1L);
        req.setInvestorEmail(investorEmail);
        req.setAmount(5000.0);

        when(repository.save(any(Investment.class))).thenAnswer(i -> {
            Investment inv = i.getArgument(0);
            inv.setId(2L);
            return inv;
        });

        Investment result = investmentService.requestInvestment(founderEmail, req);

        assertEquals(InvestmentStatus.REQUESTED, result.getStatus());
    }

    @Test
    void acceptRequest_ShouldAccept() {
        investment.setStatus(InvestmentStatus.REQUESTED);
        when(repository.findById(1L)).thenReturn(Optional.of(investment));
        when(repository.save(any(Investment.class))).thenReturn(investment);

        Investment result = investmentService.acceptRequest(1L, investorEmail);

        assertEquals(InvestmentStatus.APPROVED, result.getStatus());
    }

    @Test
    void rejectRequest_ShouldReject() {
        investment.setStatus(InvestmentStatus.REQUESTED);
        when(repository.findById(1L)).thenReturn(Optional.of(investment));
        when(repository.save(any(Investment.class))).thenReturn(investment);

        Investment result = investmentService.rejectRequest(1L, investorEmail);

        assertEquals(InvestmentStatus.REJECTED, result.getStatus());
    }

    @Test
    void getByStartup_ShouldReturnList() {
        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.findByStartupId(1L)).thenReturn(List.of(investment));

        List<Investment> result = investmentService.getByStartup(1L, founderEmail);

        assertFalse(result.isEmpty());
    }

    @Test
    void getByInvestor_ShouldReturnList() {
        when(repository.findByInvestorEmail(investorEmail)).thenReturn(List.of(investment));
        List<Investment> result = investmentService.getByInvestor(investorEmail);
        assertFalse(result.isEmpty());
    }

    @Test
    void getTotalApprovedFunding_ShouldReturnAmount() {
        when(repository.sumApprovedAmountByStartupId(1L)).thenReturn(10000.0);
        Double result = investmentService.getTotalApprovedFunding(1L);
        assertEquals(10000.0, result);
    }
}
