package com.capgemini.investment_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.capgemini.investment_service.dto.StartupResponse;

@FeignClient(name = "STARTUP-SERVICE")
public interface StartupClient {

    @GetMapping("/startups/{id}")
    StartupResponse getStartupById(@PathVariable("id") Long id);
}
