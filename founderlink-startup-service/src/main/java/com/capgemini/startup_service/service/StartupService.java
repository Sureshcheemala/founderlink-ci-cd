package com.capgemini.startup_service.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.capgemini.startup_service.dto.StartupRequest;
import com.capgemini.startup_service.entity.Startup;

public interface StartupService {

	Startup createStartup(String email, StartupRequest request);

	Page<Startup> getStartups(String search, String industry, String stage, Double minFunding, Double maxFunding,
			String sortBy, String sortDir, String email, boolean isAdmin, int page, int size);

	List<Startup> getMyStartups(String email);

	Startup getStartupById(Long id);

	Startup approve(Long id, String email);

	Startup reject(Long id, String email);

	void followStartup(Long userId, String email);

	List<Long> getFollowedStartupIds(String email);

	void deleteStartup(Long id, String email);

	Startup updateStartup(Long id, String email, StartupRequest request);

}
