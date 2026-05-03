package com.capgemini.team_service.service;

import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository repository;
    private final RabbitTemplate rabbitTemplate;
    private final StartupClient startupClient;

    //Founder invites cofounder
    public Team invite(String founderEmail, TeamInviteRequest request) {
    	
    	StartupResponse startup = startupClient.getStartupById(request.getStartupId());

    	if (!startup.getFounderEmail().equals(founderEmail)) {
    	    throw new UnauthorizedException("Not allowed");
    	}
    	
    	boolean exists = repository.existsByStartupIdAndUserEmail(
    	        request.getStartupId(), request.getUserEmail());

    	if (exists) {
    	    throw new ConflictException("User already invited/requested");
    	}

        Team team = Team.builder()
                .startupId(request.getStartupId())
                .startupName(startup.getName())
                .userEmail(request.getUserEmail())//cofounder
                .role(request.getRole())
                .type("INVITE")
                .status("INVITED")
                .invitedBy(founderEmail)
                .build();


        Team savedTeam = repository.save(team);
        
        sendEvent("TEAM_INVITE", request.getUserEmail(),
        		"You have been invited for role " + savedTeam.getRole(), savedTeam.getId());

        return savedTeam;
    }

    // Cofounder accepts invite
    public Team acceptInvite(Long id, String email) {

        Team team = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found"));

        if (!team.getUserEmail().equals(email)) {
            throw new UnauthorizedException("Not allowed");
        }
        
        if (!team.getStatus().equals("INVITED")) {
            throw new BadRequestException("Invalid state");
        }

        team.setStatus("ACCEPTED");

        Team savedTeam = repository.save(team);
        
        sendEvent("TEAM_INVITE_ACCEPT", team.getInvitedBy(),
        		"Your invite for the role " + savedTeam.getRole() + " has been accepted by the cofounder",
        		savedTeam.getId(), null);
        
        // Sync event for startup-service to increment team size
        sendEvent("TEAM_MEMBER_ADDED", team.getInvitedBy(), "sync", team.getStartupId(), null);

        return savedTeam;
    }

    // Cofounder rejects invite
    public Team rejectInvite(Long id, String email) {

        Team team = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found"));

        if (!team.getUserEmail().equals(email)) {
            throw new UnauthorizedException("Not allowed");
        }
        
        if (!team.getStatus().equals("INVITED")) {
            throw new BadRequestException("Invalid state");
        }

        team.setStatus("REJECTED");

        Team savedTeam = repository.save(team);
        
        sendEvent("TEAM_INVITE_REJECT", team.getInvitedBy(),
        		"Your invite for the role " + savedTeam.getRole() + "has been rejected by the cofounder",
        		savedTeam.getId());

        return savedTeam;
        
    }

    // Cofounder sends join request
    public Team requestToJoin(String email, JoinRequestDTO dto) {

        if (dto.getRole() == null || dto.getRole().isBlank()) {
            throw new BadRequestException("Role is required");
        }

        // Prevent duplicates
        boolean exists = repository.existsByStartupIdAndUserEmailAndStatus(
                dto.getStartupId(), email, "REQUESTED");

        if (exists) {
            throw new ConflictException("Already requested");
        }

        //startup data
        StartupResponse startup; 
        try{
        	startup = startupClient.getStartupById(dto.getStartupId());
        }catch(Exception e) {
        	throw new ResourceNotFoundException("Startup not found");
        }
        
        if (startup == null) {
            throw new ResourceNotFoundException("Startup not found");
        }

        String founderEmail = startup.getFounderEmail();
        
        Team team = Team.builder()
                .startupId(dto.getStartupId())
                .startupName(startup.getName())
                .userEmail(email)
                .role(dto.getRole())
                .type("REQUEST")
                .status("REQUESTED")
                .invitedBy(founderEmail)
                .build();


        Team savedTeam = repository.save(team);
        
        sendEvent("TEAM_JOIN_REQUEST", founderEmail,
        		"New join request for the role " + savedTeam.getRole(),
        		savedTeam.getId());

        return savedTeam;
    }

    // Founder views join requests
    public List<Team> getPendingRequests(Long startupId) {
        return repository.findByStartupIdAndStatus(startupId, "REQUESTED");
    }

    //Founder accepts join request
    public Team acceptRequest(Long id, String founderEmail) {
    	
    	Team team = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
    	
    	StartupResponse startup = startupClient.getStartupById(team.getStartupId());

    	if (!startup.getFounderEmail().equals(founderEmail)) {
    	    throw new UnauthorizedException("Not allowed");
    	}

    	if (!team.getStatus().equals("REQUESTED")) {
    	    throw new BadRequestException("Invalid state");
    	}

        team.setStatus("ACCEPTED");

        Team savedTeam = repository.save(team);
        
        sendEvent("TEAM_REQUEST_ACCEPTED", team.getUserEmail(),
        		"Your join request for the role " + savedTeam.getRole() + " has been accepted by the founder",
        		savedTeam.getId(), null);

        // Sync event for startup-service to increment team size
        sendEvent("TEAM_MEMBER_ADDED", startup.getFounderEmail(), "sync", team.getStartupId(), null);

        return savedTeam;
    }

    // Founder rejects join request
    public Team rejectRequest(Long id, String founderEmail) {

        Team team = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        
        if (!team.getStatus().equals("REQUESTED")) {
            throw new BadRequestException("Invalid state");
        }

        team.setStatus("REJECTED");
        
        Team savedTeam = repository.save(team);
        sendEvent("TEAM_REQUEST_REJECTED", team.getUserEmail(),
        		"Your invite for the role " + savedTeam.getRole() + "has been rejected by the founder",
        		savedTeam.getId());

        return savedTeam;

    }

    // Get team members
    public List<Team> getStartupTeam(Long startupId) {
        return repository.findByStartupIdAndStatus(startupId, "ACCEPTED");
    }
    
    private void sendEvent(String type, String email, String message, Long id) {
        NotificationEvent event = new NotificationEvent(type, email, message, id, null);
        rabbitTemplate.convertAndSend(RabbitMQConstants.EXCHANGE, RabbitMQConstants.ROUTING_KEY, event);
    }

    private void sendEvent(String type, String email, String message, Long id, Long ignored) {
        NotificationEvent event = new NotificationEvent(type, email, message, id, null);
        rabbitTemplate.convertAndSend(RabbitMQConstants.EXCHANGE, RabbitMQConstants.ROUTING_KEY, event);
    }
    
    public List<Team> getMyRequests(String email){
    	return repository.findByUserEmail(email);
    }

}