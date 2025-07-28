package com.backendtest.crud.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.concurrent.ConcurrentHashMap;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    // ejecuta despues de que se haya inyectado el valor de jwtSecret
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // genera un token JWT
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenAboutToExpire(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Considerar que el token está por expirar si le quedan menos de 5 minutos
            return claims.getExpiration().getTime() - System.currentTimeMillis() < 300000;
        } catch (Exception e) {
            return false;
        }
    }


    // obtiene el username del token JWT
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    private final Set<String> invalidatedTokens = Collections.synchronizedSet(new HashSet<>());
    // metodo para invalidar tokens o logout

    public void invalidateToken(String token) {
        try {
            // extraemos username y expiracion del token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            // calculamos tiempo restante del token
            long remainingTime = claims.getExpiration().getTime() - System.currentTimeMillis();

            if(remainingTime > 0) {
                invalidatedTokens.add(token);
                // Programamos eliminación después de la expiración
                new Timer().schedule(new TimerTask() {
                    @Override
                    public void run() {
                        invalidatedTokens.remove(token);
                    }
                }, remainingTime);
            }
        } catch (Exception e) {
            System.out.println("Error invalidando token: " + e.getMessage());
            // mandamos error en un JSON
            throw new RuntimeException("{\"error\": \"Error invalidando token: " + e.getMessage() + "\"}");        }
    }

    private final Map<String, String> tokenReplacements = new ConcurrentHashMap<>();

    public void allowBothTokens(String oldToken, String newToken) {
        // permitir que el antiguo token funcione por 10 segundos mas
        tokenReplacements.put(oldToken, newToken);
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                tokenReplacements.remove(oldToken);
                invalidateToken(oldToken);
            }
        }, 10000); // 10 segundos
    }

    public boolean validateToken(String token) {
        try {
            // Si es un token que esta siendo reemplazado
            if (tokenReplacements.containsKey(token)) {
                return true;
            }

            // verificar si esta invalidado
            if (invalidatedTokens.contains(token)) {
                return false;
            }

            // validacion normal
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }



}
