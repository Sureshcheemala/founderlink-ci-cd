package com.capgemini.investment_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capgemini.investment_service.dto.FundingRequest;
import com.capgemini.investment_service.dto.InvestmentRequest;
import com.capgemini.investment_service.entity.Investment;
import com.capgemini.investment_service.service.InvestmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

	private final InvestmentService investmentService;

	// Only investors can invest
	@PostMapping
	@PreAuthorize("hasRole('INVESTOR')")
	public Investment invest(Authentication authentication, @RequestBody InvestmentRequest request) {
		String email = authentication.getName();
		return investmentService.createInvestment(email, request);
	}

	// Investor views own investments
	@GetMapping("/me")
	@PreAuthorize("hasRole('INVESTOR')")
	public List<Investment> myInvestments(Authentication auth) {
		return investmentService.getByInvestor(auth.getName());
	}

	// Investor accepts invest requests
	@PutMapping("/{id}/accept-request")
	@PreAuthorize("hasRole('INVESTOR')")
	public Investment acceptRequest(@PathVariable("id") Long id, Authentication auth) {
		return investmentService.acceptRequest(id, auth.getName());
	}

	// Investor rejects invest requests
	@PutMapping("/{id}/reject-request")
	@PreAuthorize("hasRole('INVESTOR')")
	public Investment rejectRequest(@PathVariable("id") Long id, Authentication auth) {
		return investmentService.rejectRequest(id, auth.getName());
	}
	
	// Investor, Founder, Admin views invest requests
	@GetMapping("/requests")
	@PreAuthorize("hasAnyRole('INVESTOR', 'FOUNDER', 'ADMIN')")
	public List<Investment> getRequests(Authentication auth) {
		return investmentService.getRequests(auth.getName());
	}
	
	// Investor, Founder, Admin views pending invest requests
	@GetMapping("/requests/pending")
	@PreAuthorize("hasAnyRole('INVESTOR', 'FOUNDER', 'ADMIN')")
	public List<Investment> getPendingRequests(Authentication auth) {
	    return investmentService.getPendingRequests(auth.getName());
	}

	@PutMapping("/{id}/approve")
	@PreAuthorize("hasAnyRole('FOUNDER','ADMIN')")
	public ResponseEntity<Investment> approve(@PathVariable("id") Long id, Authentication authentication) {
		return ResponseEntity.ok(investmentService.approveInvestment(id, authentication.getName()));
	}

	@PutMapping("/{id}/reject")
	@PreAuthorize("hasAnyRole('FOUNDER','ADMIN')")
	public ResponseEntity<Investment> reject(@PathVariable("id") Long id, Authentication authentication) {
		return ResponseEntity.ok(investmentService.rejectInvestment(id, authentication.getName()));
	}

	// Founder views investments on their startup
	@GetMapping("/startup/{startupId}")
	@PreAuthorize("hasRole('FOUNDER')")
	public List<Investment> getStartupInvestments(@PathVariable("startupId") Long startupId, Authentication authentication) {
		return investmentService.getByStartup(startupId, authentication.getName());
	}

	@PostMapping("/request")
	@PreAuthorize("hasRole('FOUNDER')")
	public Investment requestInvestment(Authentication auth, @RequestBody FundingRequest request) {
		return investmentService.requestInvestment(auth.getName(), request);
	}

	@GetMapping("/startup/{startupId}/total")
	@PreAuthorize("hasAnyRole('INVESTOR', 'FOUNDER', 'ADMIN', 'COFOUNDER')")
	public ResponseEntity<Double> getTotalFunding(@PathVariable("startupId") Long startupId) {
		return ResponseEntity.ok(investmentService.getTotalApprovedFunding(startupId));
	}

}
