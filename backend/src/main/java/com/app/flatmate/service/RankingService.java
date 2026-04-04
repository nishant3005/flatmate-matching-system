package com.app.flatmate.service;

import com.app.flatmate.model.User;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class RankingService {

    private static final double WEIGHT_COMPATIBILITY = 0.7;
    private static final double WEIGHT_ACTIVITY = 0.15;
    private static final double WEIGHT_RECENCY = 0.1;
    private static final double WEIGHT_FEEDBACK = 0.05;

    public double computeRankingScore(double compatibilityScore, User candidate) {
        double activityBoost = getActivityBoost(candidate.getLastActiveAt());
        double recencyBoost = getRecencyBoost(candidate.getCreatedAt());
        double feedbackBoost = getFeedbackBoost(candidate.getFeedbackScore());

        return (compatibilityScore * WEIGHT_COMPATIBILITY) +
               (activityBoost * WEIGHT_ACTIVITY) +
               (recencyBoost * WEIGHT_RECENCY) +
               (feedbackBoost * WEIGHT_FEEDBACK);
    }

    private double getActivityBoost(LocalDateTime lastActiveAt) {
        if (lastActiveAt == null) return 0;
        
        long hours = Duration.between(lastActiveAt, LocalDateTime.now()).toHours();
        if (hours < 24) return 10.0;
        if (hours < 72) return 7.0;
        if (hours < 168) return 4.0;
        return 0.0;
    }

    private double getRecencyBoost(LocalDateTime createdAt) {
        if (createdAt == null) return 0;

        long days = Duration.between(createdAt, LocalDateTime.now()).toDays();
        if (days < 3) return 8.0;
        if (days < 7) return 5.0;
        return 0.0;
    }

    private double getFeedbackBoost(Integer feedbackScore) {
        if (feedbackScore == null) return 0;
        return feedbackScore.doubleValue();
    }
}
