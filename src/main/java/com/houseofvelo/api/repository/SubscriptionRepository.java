package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    Optional<Subscription> findByUserIdAndStatusAndTokensRemainingGreaterThan(
            Long userId, SubscriptionStatus status, Integer minTokens
    );

    Optional<Subscription> findByUserId(Long userId);
}
