package com.app.backend_java_b.controller;
import com.app.backend_java_b.config.JwtConfig;
import com.app.backend_java_b.dto.ErrorResponse;
import com.app.backend_java_b.dto.Item;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@RestController
public class ResourceController {
    @Autowired
    private JwtConfig jwtConfig;

    @GetMapping("/resource")
    public ResponseEntity<?> getResource(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.name()));
        }

        String token = authHeader.substring(7);
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
            Jwts.parserBuilder()
                    .setAllowedClockSkewSeconds(30)
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return ResponseEntity.ok().body(new Item(1, "Sample Item from Backend B"));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "INVALID_TOKEN"));
        }
    }
}
