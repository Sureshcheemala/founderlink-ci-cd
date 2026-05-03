package com.founderlink.auth_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;

import io.jsonwebtoken.Claims;

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

        // Check header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = authHeader.substring(7);

        try {
            // Parse ONCE
            Claims claims = jwtService.extractAllClaims(token);
            
            Boolean isActive = jwtService.extractIsActive(claims);

            if (isActive != null && !isActive) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("User is blocked");
                return;
            }

            String username = claims.getSubject();
            List<String> roles = jwtService.extractRoles(claims);

            // Set authentication if not already set
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                var authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {
        	response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        	return;
        }

        filterChain.doFilter(request, response);
    }
    
}