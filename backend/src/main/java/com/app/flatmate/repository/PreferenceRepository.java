package com.app.flatmate.repository;

import com.app.flatmate.model.Preference;
import com.app.flatmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    Optional<Preference> findByUser(User user);
    Optional<Preference> findByUserId(Long userId);
    List<Preference> findByCityIgnoreCase(String city);
}
