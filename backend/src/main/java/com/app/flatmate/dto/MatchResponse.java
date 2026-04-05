package com.app.flatmate.dto;

import java.util.List;

public class MatchResponse {
    private Long matchId;
    private Long matchedUserId;
    private String matchedUserName;
    private String matchedUserEmail;
    private Double score;
    private List<String> reasons;
    private String city;
    private java.time.LocalDateTime lastActiveAt;

    public MatchResponse() {}

    public MatchResponse(Long matchId, Long matchedUserId, String matchedUserName,
                         String matchedUserEmail, Double score, List<String> reasons, String city, java.time.LocalDateTime lastActiveAt) {
        this.matchId = matchId;
        this.matchedUserId = matchedUserId;
        this.matchedUserName = matchedUserName;
        this.matchedUserEmail = matchedUserEmail;
        this.score = score;
        this.reasons = reasons;
        this.city = city;
        this.lastActiveAt = lastActiveAt;
    }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
    public Long getMatchedUserId() { return matchedUserId; }
    public void setMatchedUserId(Long matchedUserId) { this.matchedUserId = matchedUserId; }
    public String getMatchedUserName() { return matchedUserName; }
    public void setMatchedUserName(String matchedUserName) { this.matchedUserName = matchedUserName; }
    public String getMatchedUserEmail() { return matchedUserEmail; }
    public void setMatchedUserEmail(String matchedUserEmail) { this.matchedUserEmail = matchedUserEmail; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public java.time.LocalDateTime getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(java.time.LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
}
