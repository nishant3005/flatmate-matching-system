package com.app.flatmate.service;

import com.app.flatmate.dto.PreferenceRequest;
import com.app.flatmate.model.Preference;
import com.app.flatmate.model.User;
import com.app.flatmate.repository.PreferenceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;

    public PreferenceService(PreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    public Preference savePreference(User user, PreferenceRequest req) {
        Preference pref = preferenceRepository.findByUser(user).orElse(new Preference());
        pref.setUser(user);
        pref.setSleepCycle(req.getSleepCycle());
        pref.setCleanliness(req.getCleanliness());
        pref.setSmoking(req.getSmoking());
        pref.setDrinking(req.getDrinking());
        pref.setBudgetMin(req.getBudgetMin());
        pref.setBudgetMax(req.getBudgetMax());
        pref.setFoodPreference(req.getFoodPreference());
        pref.setWorkType(req.getWorkType());
        pref.setGuestsFrequency(req.getGuestsFrequency());
        pref.setCity(req.getCity());
        return preferenceRepository.save(pref);
    }

    public Optional<Preference> getPreferenceByUser(User user) {
        return preferenceRepository.findByUser(user);
    }

    public Optional<Preference> getPreferenceByUserId(Long userId) {
        return preferenceRepository.findByUserId(userId);
    }
}
