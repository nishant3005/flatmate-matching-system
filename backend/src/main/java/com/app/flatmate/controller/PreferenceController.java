package com.app.flatmate.controller;

import com.app.flatmate.dto.PreferenceRequest;
import com.app.flatmate.model.Preference;
import com.app.flatmate.model.User;
import com.app.flatmate.service.PreferenceService;
import com.app.flatmate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/preferences")
public class PreferenceController {

    private final PreferenceService preferenceService;
    private final UserService userService;

    public PreferenceController(PreferenceService preferenceService, UserService userService) {
        this.preferenceService = preferenceService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody PreferenceRequest req, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        Preference saved = preferenceService.savePreference(user, req);
        return ResponseEntity.ok(Map.of("message", "Preferences saved", "id", saved.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyPreferences(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        Optional<Preference> pref = preferenceService.getPreferenceByUser(user);
        return pref.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        Optional<Preference> pref = preferenceService.getPreferenceByUserId(userId);
        return pref.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
