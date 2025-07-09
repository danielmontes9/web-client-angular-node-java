package com.app.backend_java_b.controller;

import com.app.backend_java_b.config.JwtConfig;
import com.app.backend_java_b.dto.AuthRequest;
import com.app.backend_java_b.dto.AuthResponse;
import com.app.backend_java_b.dto.ErrorResponse;
import com.app.backend_java_b.services.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    AuthService authService;

    private SecretKey SECRET_KEY;
    private Key key;

    private static final Set<String> refreshTokenStore = Collections.synchronizedSet(new HashSet<>());

    @PostConstruct
    public void init() {
        SECRET_KEY = new SecretKeySpec(jwtConfig.getSecret().getBytes(), "HmacSHA256");
        key = new SecretKeySpec(SECRET_KEY.getEncoded(), "HmacSHA256");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        if ("user@example.com".equals(request.getEmail()) && "password".equals(request.getPassword())) {
            String accessToken = authService.generateToken(request.getEmail(), jwtConfig.getAccessTokenTtl());
            String refreshToken = authService.generateToken(request.getEmail(), jwtConfig.getRefreshTokenTtl());
            refreshTokenStore.add(refreshToken);
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        }
        return ResponseEntity.status(401).body(new ErrorResponse(401, "INVALID_CREDENTIALS"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || !refreshTokenStore.contains(refreshToken)) {
            return ResponseEntity.status(403).body(new ErrorResponse(403, "INVALID_REFRESH_TOKEN"));
        }
        try {
            Claims claims = Jwts.parser().setSigningKey(jwtConfig.getSecret().getBytes()).parseClaimsJws(refreshToken).getBody();
            String newAccessToken = authService.generateToken(claims.getSubject(), jwtConfig.getAccessTokenTtl());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(403).body(new ErrorResponse(403, "REFRESH_TOKEN_EXPIRED"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        refreshTokenStore.remove(refreshToken);
        return ResponseEntity.ok("Logged out");
    }
}
