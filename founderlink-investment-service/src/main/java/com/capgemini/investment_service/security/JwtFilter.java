package com.capgemini.investment_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getRequestURI();

		if (path.contains("api-docs") || path.contains("swagger")) {
		    filterChain.doFilter(request, response);
		    return;
		}

		String authHeader = request.getHeader("Authorization");

		// Skip if no token
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7);

		try {

			Claims claims = jwtService.extractAllClaims(token);

			String email = claims.getSubject();

			Boolean isActive = claims.get("isActive", Boolean.class);

			if (isActive != null && !isActive) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				response.getWriter().write("User is blocked");
				return;
			}

			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				if (jwtService.validateToken(token)) {

					List<String> roles = jwtService.extractRoles(token);

					var authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();

					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null,
							authorities);

					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		} catch (Exception e) {

			filterChain.doFilter(request, response);
			return;
		}
		filterChain.doFilter(request, response);
	}
	
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {

	    String path = request.getRequestURI();

	    return path.startsWith("/v3/api-docs") ||
	           path.startsWith("/swagger-ui") ||
	           path.startsWith("/swagger-ui.html") ||
	           path.startsWith("/investments/v3/api-docs") ||
	           path.startsWith("/investments/swagger-ui");
	}
}