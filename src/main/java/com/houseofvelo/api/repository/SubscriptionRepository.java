package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Find all subscriptions for a user
    List<Subscription> findByUserId(Long userId);

    // Find active subscription for a specific player and session type option
    Optional<Subscription> findByPlayerIdAndSessionTypeOptionIdAndStatus(
            Long playerId, Long sessionTypeOptionId, SubscriptionStatus status
    );

    // Find all subscriptions for a player
    List<Subscription> findByPlayerId(Long playerId);

    // Find active subscriptions for a player with available tokens
    List<Subscription> findByPlayerIdAndStatusAndTokensRemainingGreaterThan(
            Long playerId, SubscriptionStatus status, Integer minTokens
    );

    // Find all active subscriptions for a user (across all their players)
    List<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
}
