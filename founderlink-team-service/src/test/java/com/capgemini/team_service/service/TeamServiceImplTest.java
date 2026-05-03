package com.capgemini.team_service.service;

import com.capgemini.team_service.config.RabbitMQConstants;
import com.capgemini.team_service.dto.JoinRequestDTO;
import com.capgemini.team_service.dto.NotificationEvent;
import com.capgemini.team_service.dto.StartupResponse;
import com.capgemini.team_service.dto.TeamInviteRequest;
import com.capgemini.team_service.entity.Team;
import com.capgemini.team_service.exception.BadRequestException;
import com.capgemini.team_service.exception.ConflictException;
import com.capgemini.team_service.exception.ResourceNotFoundException;
import com.capgemini.team_service.exception.UnauthorizedException;
import com.capgemini.team_service.fiegn.StartupClient;
import com.capgemini.team_service.repository.TeamRepository;
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
public class TeamServiceImplTest {

    @Mock
    private TeamRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private StartupClient startupClient;

    @InjectMocks
    private TeamServiceImpl teamService;

    private Team team;
    private StartupResponse startup;
    private String founderEmail = "founder@test.com";
    private String cofounderEmail = "cofounder@test.com";

    @BeforeEach
    void setUp() {
        team = Team.builder()
                .id(1L)
                .startupId(1L)
                .userEmail(cofounderEmail)
                .role("CTO")
                .status("INVITED")
                .invitedBy(founderEmail)
                .build();

        startup = new StartupResponse();
        startup.setId(1L);
        startup.setName("StartupName");
        startup.setFounderEmail(founderEmail);
    }

    @Test
    void invite_ShouldCreateInvite() {
        TeamInviteRequest req = new TeamInviteRequest();
        req.setStartupId(1L);
        req.setUserEmail(cofounderEmail);
        req.setRole("CTO");

        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.existsByStartupIdAndUserEmail(1L, cofounderEmail)).thenReturn(false);
        when(repository.save(any(Team.class))).thenReturn(team);

        Team result = teamService.invite(founderEmail, req);

        assertNotNull(result);
        assertEquals("INVITED", result.getStatus());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void invite_ShouldThrowUnauthorized() {
        TeamInviteRequest req = new TeamInviteRequest();
        req.setStartupId(1L);
        when(startupClient.getStartupById(1L)).thenReturn(startup);

        assertThrows(UnauthorizedException.class, () -> teamService.invite("wrong@test.com", req));
    }

    @Test
    void invite_ShouldThrowConflict() {
        TeamInviteRequest req = new TeamInviteRequest();
        req.setStartupId(1L);
        req.setUserEmail(cofounderEmail);
        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.existsByStartupIdAndUserEmail(1L, cofounderEmail)).thenReturn(true);

        assertThrows(ConflictException.class, () -> teamService.invite(founderEmail, req));
    }

    @Test
    void acceptInvite_ShouldUpdateStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(repository.save(any(Team.class))).thenReturn(team);

        Team result = teamService.acceptInvite(1L, cofounderEmail);

        assertEquals("ACCEPTED", result.getStatus());
        verify(rabbitTemplate, times(2)).convertAndSend(anyString(), anyString(), any(NotificationEvent.class));
    }

    @Test
    void acceptInvite_ShouldThrowUnauthorized() {
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        assertThrows(UnauthorizedException.class, () -> teamService.acceptInvite(1L, "wrong@test.com"));
    }

    @Test
    void rejectInvite_ShouldUpdateStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(repository.save(any(Team.class))).thenReturn(team);

        Team result = teamService.rejectInvite(1L, cofounderEmail);

        assertEquals("REJECTED", result.getStatus());
    }

    @Test
    void requestToJoin_ShouldCreateRequest() {
        JoinRequestDTO dto = new JoinRequestDTO();
        dto.setStartupId(1L);
        dto.setRole("Developer");

        when(repository.existsByStartupIdAndUserEmailAndStatus(1L, cofounderEmail, "REQUESTED")).thenReturn(false);
        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.save(any(Team.class))).thenAnswer(i -> {
            Team t = i.getArgument(0);
            t.setId(2L);
            return t;
        });

        Team result = teamService.requestToJoin(cofounderEmail, dto);

        assertNotNull(result);
        assertEquals("REQUESTED", result.getStatus());
        assertEquals("REQUEST", result.getType());
    }

    @Test
    void acceptRequest_ShouldUpdateStatus() {
        team.setStatus("REQUESTED");
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(startupClient.getStartupById(1L)).thenReturn(startup);
        when(repository.save(any(Team.class))).thenReturn(team);

        Team result = teamService.acceptRequest(1L, founderEmail);

        assertEquals("ACCEPTED", result.getStatus());
    }

    @Test
    void rejectRequest_ShouldUpdateStatus() {
        team.setStatus("REQUESTED");
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(repository.save(any(Team.class))).thenReturn(team);

        Team result = teamService.rejectRequest(1L, founderEmail);

        assertEquals("REJECTED", result.getStatus());
    }

    @Test
    void getStartupTeam_ShouldReturnList() {
        when(repository.findByStartupIdAndStatus(1L, "ACCEPTED")).thenReturn(List.of(team));
        List<Team> result = teamService.getStartupTeam(1L);
        assertFalse(result.isEmpty());
    }
}
