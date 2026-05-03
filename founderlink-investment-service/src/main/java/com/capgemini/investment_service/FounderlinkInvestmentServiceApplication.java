package com.capgemini.investment_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class FounderlinkInvestmentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FounderlinkInvestmentServiceApplication.class, args);
	}

}
