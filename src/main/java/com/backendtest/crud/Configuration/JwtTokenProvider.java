package com.backendtest.crud.Configuration;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
        // agrega el token a la lista de tokens invalidados
        invalidatedTokens.add(token);
    }

    // valida el token JWT
    public boolean validateToken(String token) {
        try{
            // verificamos si el token esta en la lista de tokens invalidados
            if (invalidatedTokens.contains(token)) {
                return false;
            }
            // intenta parsear el token con la clave secreta
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // si ocurre una excepcion, el token no es valido
            return false;
        }
    }



}
