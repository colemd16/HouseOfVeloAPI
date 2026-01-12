package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Sport;
import com.houseofvelo.api.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {

    // Find trainer by user ID (for "my profile")
    Optional<Trainer> findByUserId(Long userId);

    // Check if trainer exists for user
    boolean existsByUserId(Long userId);

    List<Trainer> findByIsActiveTrue();

    List<Trainer> findBySportsContaining(Set<Sport> sports);
}
