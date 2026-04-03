package com.hrms.controller;

import com.hrms.dto.LoginRequest;
import com.hrms.dto.LoginResponse;
import com.hrms.model.Role;
import com.hrms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "EMPLOYEE");
        authService.register(email, password, Role.valueOf(role));
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}
