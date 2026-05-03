package com.capgemini.team_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JoinRequestDTO {
	@NotNull(message = "Startup ID is required")
	@Positive(message = "Startup ID must be positive")
	private Long startupId;

	@NotBlank(message = "Role is required")
	@Size(max = 50)
	private String role;

	@Size(max = 300)
	private String message;
}
