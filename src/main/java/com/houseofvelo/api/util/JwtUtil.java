package com.houseofvelo.api.util;

import com.houseofvelo.api.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration; // milliseconds

    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate token for user
    public String generateToken(String email, Role role){
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("role", role.name()); // Convert enum to String for JWT storage
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    }

    // Extract role from token
    public Role extractRole(String token){
        String roleString = extractClaim(token, claims -> claims.get("role", String.class));
        return Role.valueOf(roleString);
    }

    // Extract expiration date
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //Parse and validate token, extract all claims
    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Check if token is expired
    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //Validate token
    public Boolean validateToken(String token, String email){
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

}
