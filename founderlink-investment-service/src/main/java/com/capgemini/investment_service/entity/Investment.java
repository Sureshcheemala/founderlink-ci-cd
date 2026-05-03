package com.capgemini.investment_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Investment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long startupId;
	private String investorEmail;
	private String founderEmail;
	private Double amount;
	
	@Enumerated(EnumType.STRING)
	private InitiatorType initiatedBy; //Founder, Investor
	
	@Enumerated(EnumType.STRING)
	private InvestmentStatus status; //PENDING, APPROVED, REJECTED, COMPLETED
	
	private LocalDateTime createdAt;
}
