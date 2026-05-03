package com.capgemini.team_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeamInviteRequest {
	@NotNull(message = "Startup ID is required")
	@Positive(message = "Startup ID must be positive")
	private Long startupId;

	@NotBlank(message = "User email is required")
	@Email(message = "Invalid email format")
	@Size(max = 100)
	private String userEmail;

	@NotBlank(message = "Role is required")
	@Size(max = 50)
	private String role;
}
