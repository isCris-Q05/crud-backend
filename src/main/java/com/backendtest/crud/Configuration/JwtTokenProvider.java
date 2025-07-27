package com.backendtest.crud.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
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

    public boolean validateToken(String token) {
        try {
            System.out.println("Validando token ...: " + token);
            System.out.println("Tokens invalidados actuales: " + invalidatedTokens);

            // Verificar primero si el token está invalidado
            if (invalidatedTokens.contains(token)) {
                System.out.println("Token encontrado como invalido: " + token);
                return false;
            }

            // Luego verificar validez JWT (firma y expiración)
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            System.out.println("Token valido: " + token);
            return true;
        } catch (Exception e) {
            System.out.println("Error validando: " + e.getMessage());
            return false;
        }
    }



}
