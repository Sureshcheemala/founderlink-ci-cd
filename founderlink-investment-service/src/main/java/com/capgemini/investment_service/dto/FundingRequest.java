package com.capgemini.investment_service.dto;

import lombok.Data;

@Data
public class FundingRequest {

	private Long startupId;
	private String investorEmail;
	private Double amount;
}
