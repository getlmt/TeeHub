package com.example.backend.Sercurity;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.*;
import java.util.*;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}") private String secret;

    private Key key() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }

    public String generateToken(String subject, Collection<String> roles, Duration ttl) {
        Date now = new Date();
        Date exp = Date.from(Instant.now().plus(ttl));
        return Jwts.builder()
                .setSubject(subject)
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parser(token).getBody().getSubject();
    }

    public boolean isExpired(String token) {
        return parser(token).getBody().getExpiration().before(new Date());
    }

    private Jws<Claims> parser(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
    }
}
