package com.capgemini.notification_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;

@Service
public class JwtService {

    private static final String SECRET = "ejfbniuNeJFkJDneaiKJKNol298y2938tjleknjrjebfuyiwefg";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // Parse once and reuse everywhere
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);

        Object rolesObj = claims.get("roles");

        if (rolesObj instanceof List<?> rolesList) {
            return rolesList.stream()
                    .map(Object::toString)
                    .toList();
        }

        return List.of(); // safe fallback
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // parsing = validation
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
//    public Boolean extractIsActive(Claims claims) {
//        Object active = claims.get("isActive");
//        return active != null && Boolean.parseBoolean(active.toString());
//    }
}