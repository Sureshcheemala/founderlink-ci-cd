package com.capgemini.user_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.capgemini.user_service.security.JwtFilter;

import jakarta.annotation.PostConstruct;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ MUST

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers(
            			    "/swagger-ui/**",
            			    "/swagger-ui.html",
            			    "/v3/api-docs/**",
            			    "/v3/api-docs",
            			    "/swagger-resources/**",
            			    "/v3/api-docs",
            			    "/users/v3/api-docs/**"
            			).permitAll()
            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(jwtFilterBean(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    @Bean
    public JwtFilter jwtFilterBean() {
        return jwtFilter;
    }
    
}