package com.capgemini.investment_service.service;

import java.util.List;

import com.capgemini.investment_service.dto.FundingRequest;
import com.capgemini.investment_service.dto.InvestmentRequest;
import com.capgemini.investment_service.entity.Investment;

public interface InvestmentService {
	
	Investment createInvestment(String email, InvestmentRequest request);
	
	Investment approveInvestment(Long id, String email);
	
	Investment rejectInvestment(Long id, String email);
	
	List<Investment> getByStartup(Long startupId, String email);
	
	List<Investment> getByInvestor(String email);
	
	List<Investment> getPendingRequests(String investorEmail);
	
	Investment requestInvestment(String founderEmail, FundingRequest fundingRequest);
	
	Investment acceptRequest(Long id, String investorEmail);
	
	Investment rejectRequest(Long id, String investorEmail);
	
	List<Investment> getRequests(String investorEmail);

	Double getTotalApprovedFunding(Long startupId);
}
