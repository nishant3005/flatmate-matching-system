package com.app.flatmate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "matched_user_id")
    private User matchedUser;

    @Column(name = "score")
    private Double score;

    @Column(name = "reasons", columnDefinition = "TEXT")
    private String reasons;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Match() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Builder
    public static MatchBuilder builder() { return new MatchBuilder(); }

    public static class MatchBuilder {
        private User user;
        private User matchedUser;
        private Double score;
        private String reasons;

        public MatchBuilder user(User user) { this.user = user; return this; }
        public MatchBuilder matchedUser(User matchedUser) { this.matchedUser = matchedUser; return this; }
        public MatchBuilder score(Double score) { this.score = score; return this; }
        public MatchBuilder reasons(String reasons) { this.reasons = reasons; return this; }

        public Match build() {
            Match m = new Match();
            m.user = this.user; m.matchedUser = this.matchedUser;
            m.score = this.score; m.reasons = this.reasons;
            return m;
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public User getMatchedUser() { return matchedUser; }
    public void setMatchedUser(User matchedUser) { this.matchedUser = matchedUser; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getReasons() { return reasons; }
    public void setReasons(String reasons) { this.reasons = reasons; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
