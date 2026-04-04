package com.app.flatmate.controller;

import com.app.flatmate.config.JwtUtil;
import com.app.flatmate.dto.AuthResponse;
import com.app.flatmate.dto.LoginRequest;
import com.app.flatmate.dto.SignupRequest;
import com.app.flatmate.model.User;
import com.app.flatmate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userService.existsByEmail(req.getEmail()))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered"));

        User user = userService.save(User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .build());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(jwtUtil.generateToken(user.getEmail()),
                        user.getId(), user.getName(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userService.findByEmail(req.getEmail());
        user.setLastActiveAt(java.time.LocalDateTime.now());
        userService.save(user);
        return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(user.getEmail()),
                user.getId(), user.getName(), user.getEmail()));
    }
}
