package com.capgemini.team_service.service;

import java.util.List;

import com.capgemini.team_service.dto.JoinRequestDTO;
import com.capgemini.team_service.dto.TeamInviteRequest;
import com.capgemini.team_service.entity.Team;

public interface TeamService {

	Team invite(String founderEmail, TeamInviteRequest request);
	
	Team acceptInvite(Long id, String email);
	
	Team rejectInvite(Long id, String email);
	
	Team requestToJoin(String email, JoinRequestDTO dto);
	
	List<Team> getPendingRequests(Long startupId);
	
	List<Team> getStartupTeam(Long startupId);
	
	Team acceptRequest(Long id, String founderEmail);
	
	Team rejectRequest(Long id, String founderEmail);
	
	List<Team> getMyRequests(String email);
	
}
