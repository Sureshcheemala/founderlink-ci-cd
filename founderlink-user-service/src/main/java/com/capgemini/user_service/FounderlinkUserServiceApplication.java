package com.capgemini.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
	    scanBasePackages = "com.capgemini",
	    exclude = {
	        org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
	    }
	)
public class FounderlinkUserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FounderlinkUserServiceApplication.class, args);
	}

}
