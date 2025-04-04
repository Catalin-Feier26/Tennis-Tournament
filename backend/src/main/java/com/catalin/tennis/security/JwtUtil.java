package com.catalin.tennis.security;

import com.catalin.tennis.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key used for signing the JWT. In production, store this securely.
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token validity period (e.g., 1 hour)
    private final long jwtExpirationInMs = 3600000;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(key)
                .compact();
    }

    // Optional: Add methods for token validation and parsing if needed.
}
