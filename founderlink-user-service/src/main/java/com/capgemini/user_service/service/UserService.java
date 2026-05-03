package com.capgemini.user_service.service;

import java.util.List;

import com.capgemini.user_service.dto.UserProfileRequest;
import com.capgemini.user_service.entity.UserProfile;

public interface UserService {

	UserProfile createOrUpdateProfile(String email, UserProfileRequest request);
	
	public UserProfile getProfile(String email);
	
	List<UserProfile> getAllUsers();
	
	UserProfile getUserById(Long id);
	
	List<UserProfile> searchProfiles(String query);
}

