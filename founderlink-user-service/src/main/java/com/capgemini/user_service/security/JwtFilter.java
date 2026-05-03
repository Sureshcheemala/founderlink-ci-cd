package com.capgemini.user_service.security;

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
	protected void doFilterInternal(HttpServletRequest request,
	                               HttpServletResponse response,
	                               FilterChain filterChain)
	        throws ServletException, IOException {
		

		String path = request.getRequestURI();

		if (path.contains("/v3/api-docs") ||
			    path.contains("/swagger") ||
			    path.contains("/swagger-ui")) {

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

	    Claims claims = jwtService.extractAllClaims(token);
	    
	    String email = claims.getSubject();

	    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

	        if (jwtService.validateToken(token)) {

	            List<String> roles = jwtService.extractRoles(token);

	            Boolean isActive = claims.get("isActive", Boolean.class);

	            if (isActive != null && !isActive) {
	                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
	                response.getWriter().write("User is blocked");
	                return;
	            }

	            // Fix role prefix issue
	            var authorities = roles.stream()
	                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
	                    .map(SimpleGrantedAuthority::new)
	                    .toList();

	            UsernamePasswordAuthenticationToken authToken =
	                    new UsernamePasswordAuthenticationToken(email, null, authorities);

	            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

	            SecurityContextHolder.getContext().setAuthentication(authToken);
	        }
	    }

	    filterChain.doFilter(request, response);
	}
}