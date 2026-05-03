package com.founderlink.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.List;

@Component
public class JwtUtil {

	private final String SECRET = "ejfbniuNeJFkJDneaiKJKNol298y2938tjleknjrjebfuyiwefg";

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

	public List<String> extractRolesFromClaims(Claims claims) {

		Object rolesObj = claims.get("roles");

		if (rolesObj == null) {
			return List.of();
		}

		if (rolesObj instanceof List<?> rolesList) {
			return rolesList.stream().map(Object::toString).toList();
		}

		if (rolesObj instanceof String role) {
			return List.of(role);
		}

		return List.of();
	}
}