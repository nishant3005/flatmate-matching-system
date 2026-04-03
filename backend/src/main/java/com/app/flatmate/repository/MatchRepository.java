package com.app.flatmate.repository;

import com.app.flatmate.model.Match;
import com.app.flatmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByUserOrderByScoreDesc(User user);
    void deleteByUser(User user);
}
