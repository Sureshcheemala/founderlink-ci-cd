package com.capgemini.user_service.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.capgemini.user_service.dto.UserProfileRequest;
import com.capgemini.user_service.entity.UserProfile;
import com.capgemini.user_service.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

	private final UserService userService;

	@PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER', 'ADMIN')")
	@PostMapping("/profile")
	public UserProfile createOrUpdateProfile(
	        Authentication authentication,
	        @RequestBody UserProfileRequest request) {

	    String email = authentication.getName();
	    return userService.createOrUpdateProfile(email, request);
	}

	@PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER', 'ADMIN')")
	@GetMapping("/profile")
	public UserProfile getProfile(Authentication authentication) {

		return userService.getProfile(authentication.getName());
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER','ADMIN')")
	public UserProfile getUserById(@PathVariable("id") Long id) {
	    return userService.getUserById(id);
	}
	
	@GetMapping("/all")
	@PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER','ADMIN')")
	public List<UserProfile> getAllUsers() {
	    return userService.getAllUsers();
	}

	@GetMapping("/search")
	@PreAuthorize("hasAnyRole('FOUNDER','INVESTOR','COFOUNDER','ADMIN')")
	public List<UserProfile> searchProfiles(@RequestParam String query) {
		return userService.searchProfiles(query);
	}
}
