package com.capgemini.investment_service.dto;

import lombok.Data;

@Data
public class InvestmentRequest {

	private Long startupId;
	private Double amount;
}
