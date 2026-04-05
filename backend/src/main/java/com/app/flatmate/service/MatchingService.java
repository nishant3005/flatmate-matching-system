package com.app.flatmate.service;

import com.app.flatmate.dto.MatchResponse;
import com.app.flatmate.model.Match;
import com.app.flatmate.model.Preference;
import com.app.flatmate.model.User;
import com.app.flatmate.repository.MatchRepository;
import com.app.flatmate.repository.PreferenceRepository;
import com.app.flatmate.util.MatchingAlgorithm;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MatchingService {

    private final PreferenceRepository preferenceRepository;
    private final MatchRepository matchRepository;
    private final ObjectMapper objectMapper;
    private final RankingService rankingService;

    public MatchingService(PreferenceRepository preferenceRepository,
                           MatchRepository matchRepository,
                           ObjectMapper objectMapper,
                           RankingService rankingService) {
        this.preferenceRepository = preferenceRepository;
        this.matchRepository = matchRepository;
        this.objectMapper = objectMapper;
        this.rankingService = rankingService;
    }

    @Transactional
    public List<MatchResponse> computeMatches(User currentUser) throws Exception {
        Preference myPref = preferenceRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Please complete your preferences first."));

        // Candidate pool — same city filter
        List<Preference> candidates;
        if (myPref.getCity() != null && !myPref.getCity().isBlank()) {
            candidates = new ArrayList<>(preferenceRepository.findByCityIgnoreCase(myPref.getCity()));
        } else {
            candidates = new ArrayList<>(preferenceRepository.findAll());
        }
        // Remove self & filter by budget overlap
        candidates.removeIf(p -> p.getUser().getId().equals(currentUser.getId()));
        candidates.removeIf(p -> !budgetOverlaps(myPref, p));

        // Score all candidates
        record Scored(Preference pref, double rawScore, double finalRank, List<String> reasons) {}
        List<Scored> scored = new ArrayList<>();
        for (Preference cp : candidates) {
            List<String> reasons = new ArrayList<>();
            double rawScore = MatchingAlgorithm.computeScore(myPref, cp, reasons);
            if (rawScore >= 33.0) {
                double finalRank = rankingService.computeRankingScore(rawScore, cp.getUser());
                scored.add(new Scored(cp, rawScore, finalRank, reasons));
            }
        }
        scored.sort(Comparator.comparingDouble(Scored::finalRank).reversed());

        // Delete old matches, save new top-20
        matchRepository.deleteByUser(currentUser);

        List<MatchResponse> responses = new ArrayList<>();
        for (Scored s : scored.subList(0, Math.min(20, scored.size()))) {
            String reasonsJson = objectMapper.writeValueAsString(s.reasons());
            Match saved = matchRepository.save(Match.builder()
                    .user(currentUser)
                    .matchedUser(s.pref().getUser())
                    .score(s.rawScore())
                    .reasons(reasonsJson)
                    .build());
            responses.add(toResponse(saved, s.reasons(), s.pref().getCity()));
        }
        return responses;
    }

    public List<MatchResponse> getMatches(User user) {
        return matchRepository.findByUserOrderByScoreDesc(user).stream()
                .map(m -> {
                    List<String> reasons = parseReasons(m.getReasons());
                    String city = preferenceRepository.findByUser(m.getMatchedUser())
                            .map(Preference::getCity).orElse("");
                    return toResponse(m, reasons, city);
                }).toList();
    }

    private MatchResponse toResponse(Match m, List<String> reasons, String city) {
        return new MatchResponse(
                m.getId(),
                m.getMatchedUser().getId(),
                m.getMatchedUser().getName(),
                m.getMatchedUser().getEmail(),
                m.getScore(),
                reasons,
                city != null ? city : "",
                m.getMatchedUser().getLastActiveAt()
        );
    }

    private List<String> parseReasons(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private boolean budgetOverlaps(Preference a, Preference b) {
        if (a.getBudgetMin() == null || b.getBudgetMin() == null) return true;
        return a.getBudgetMin() <= b.getBudgetMax() && b.getBudgetMin() <= a.getBudgetMax();
    }
}
