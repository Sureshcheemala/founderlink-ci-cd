package com.capgemini.team_service.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capgemini.team_service.dto.JoinRequestDTO;
import com.capgemini.team_service.dto.TeamInviteRequest;
import com.capgemini.team_service.entity.Team;
import com.capgemini.team_service.service.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // Founder invites cofounder
    @PostMapping("/invite")
    @PreAuthorize("hasRole('FOUNDER')")
    public Team invite(Authentication auth,
                       @RequestBody TeamInviteRequest request) {

        return teamService.invite(auth.getName(), request);
    }

    
    // cofounder accepts invite
    @PutMapping("/invite/{id}/accept")
    @PreAuthorize("hasRole('COFOUNDER')")
    public Team accept(@PathVariable("id") Long id, Authentication auth) {
        return teamService.acceptInvite(id, auth.getName());
    }
    
    
    // Cofounder rejects invite
    @PutMapping("/invite/{id}/reject")
    @PreAuthorize("hasRole('COFOUNDER')")
    public Team reject(@PathVariable("id") Long id, Authentication authentication) {
        return teamService.rejectInvite(id, authentication.getName());
    }

    // Cofounder sends join request
    @PostMapping("/join")
    @PreAuthorize("hasRole('COFOUNDER')")
    public Team requestToJoin(Authentication auth,
                              @RequestBody JoinRequestDTO dto) {

        return teamService.requestToJoin(auth.getName(), dto);
    }

    // Founder views pending requests
    @GetMapping("/requests/{startupId}")
    @PreAuthorize("hasRole('FOUNDER')")
    public List<Team> getRequests(@PathVariable("startupId") Long startupId) {
        return teamService.getPendingRequests(startupId);
    }

    @PutMapping("/request/{id}/accept")
    @PreAuthorize("hasRole('FOUNDER')")
    public Team acceptRequest(@PathVariable("id") Long id, Authentication auth) {
        return teamService.acceptRequest(id, auth.getName());
    }

    // Founder rejects request
    @PutMapping("/request/{id}/reject")
    @PreAuthorize("hasRole('FOUNDER')")
    public Team rejectRequest(@PathVariable("id") Long id, Authentication authentication) {
        return teamService.rejectRequest(id, authentication.getName());
    }

    // View team
    @GetMapping("/startup/{startupId}")
    @PreAuthorize("hasAnyRole('FOUNDER', 'COFOUNDER', 'INVESTOR')")
    public List<Team> getTeam(@PathVariable("startupId") Long startupId) {

        return teamService.getStartupTeam(startupId);
    }
    
    //Cofounder sees his sent requests
    @GetMapping("/requests/me")
    @PreAuthorize("hasRole('COFOUNDER')")
    public List<Team> getSentRequest(Authentication authentication){
    	return teamService.getMyRequests(authentication.getName());
    }
}
