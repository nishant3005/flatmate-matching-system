package com.app.flatmate.controller;

import com.app.flatmate.dto.MatchResponse;
import com.app.flatmate.model.User;
import com.app.flatmate.service.MatchingService;
import com.app.flatmate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchingService matchingService;
    private final UserService userService;

    public MatchController(MatchingService matchingService, UserService userService) {
        this.matchingService = matchingService;
        this.userService = userService;
    }

    @PostMapping("/compute")
    public ResponseEntity<?> compute(Authentication auth) {
        try {
            User user = userService.findByEmail(auth.getName());
            List<MatchResponse> matches = matchingService.computeMatches(user);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatches(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        return ResponseEntity.ok(matchingService.getMatches(user));
    }
}
