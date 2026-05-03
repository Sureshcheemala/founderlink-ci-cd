package com.founderlink.api_gateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;




@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();

	    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);

	    return source;
	}

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        return http
        	.cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF
            .csrf(ServerHttpSecurity.CsrfSpec::disable)

            .exceptionHandling(ex -> ex
            	    .authenticationEntryPoint((exchange, ex2) -> {
            	        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            	        return exchange.getResponse().setComplete();
            	    })
            	)
            // Disable default login popup
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)

            .authorizeExchange(exchanges -> exchanges

                // Allow preflight requests
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Swagger + API Docs
                .pathMatchers(
                	"/auth/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/webjars/**",
                    "/auth/v3/api-docs/**",
                    "/users/v3/api-docs/**",
                    "/startups/v3/api-docs/**",
                    "/investments/v3/api-docs/**",
                    "/teams/v3/api-docs/**",
                    "/notifications/v3/api-docs/**"
                ).permitAll()

                // Everything else secured
                .anyExchange().permitAll()
            )
            .build();
    }
}