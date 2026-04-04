package com.app.flatmate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    @Column(name = "feedback_score")
    private Integer feedbackScore = 0;

    public User() {}

    public User(Long id, String name, String email, String password, LocalDateTime createdAt, LocalDateTime lastActiveAt, Integer feedbackScore) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.lastActiveAt = lastActiveAt;
        this.feedbackScore = feedbackScore;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastActiveAt = LocalDateTime.now();
    }

    // Builder
    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private LocalDateTime lastActiveAt;
        private Integer feedbackScore = 0;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder lastActiveAt(LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; return this; }
        public UserBuilder feedbackScore(Integer feedbackScore) { this.feedbackScore = feedbackScore; return this; }

        public User build() {
            User u = new User();
            u.id = this.id; u.name = this.name;
            u.email = this.email; u.password = this.password;
            u.lastActiveAt = this.lastActiveAt;
            u.feedbackScore = this.feedbackScore;
            return u;
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
    public Integer getFeedbackScore() { return feedbackScore; }
    public void setFeedbackScore(Integer feedbackScore) { this.feedbackScore = feedbackScore; }
}
