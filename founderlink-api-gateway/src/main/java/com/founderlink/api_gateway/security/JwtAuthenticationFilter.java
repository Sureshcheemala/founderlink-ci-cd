package com.founderlink.api_gateway.security;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.cloud.gateway.filter.*;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

	private final JwtUtil jwtUtil;

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

	    String path = exchange.getRequest().getURI().getPath();
	    
	    if (isPublicPath(path)) {
	        return chain.filter(exchange);
	    }

	    String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
	        return exchange.getResponse().setComplete();
	    }

	    String token = authHeader.substring(7);

	    if (!jwtUtil.validateToken(token)) {
	        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
	        return exchange.getResponse().setComplete();
	    }

	    Claims claims;
	    try {
	        claims = jwtUtil.extractAllClaims(token);
	    } catch (Exception e) {
	        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
	        return exchange.getResponse().setComplete();
	    }
	    String email = claims.getSubject();
	    List<String> roles = jwtUtil.extractRolesFromClaims(claims);

	    String rolesHeader = String.join(",", roles);

	    ServerWebExchange mutatedExchange = exchange.mutate()
	    	    .request(exchange.getRequest().mutate()
	    	        .header("X-User-Email", email)
	    	        .header("X-User-Roles", rolesHeader)
	    	        .build())
	    	    .build();

	    return chain.filter(mutatedExchange);
	}
	
	private boolean isPublicPath(String path) {
	    return path.startsWith("/auth") ||

	           path.startsWith("/swagger-ui") ||
	           path.contains("/v3/api-docs") ||
	           path.startsWith("/webjars") ||

	           path.startsWith("/eureka") ||
	           path.startsWith("/actuator");
	}

	@Override
	public int getOrder() {
		return -1; // high priority
	}
}