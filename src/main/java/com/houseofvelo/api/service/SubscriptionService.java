package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.SubscriptionRequest;
import com.houseofvelo.api.dto.SubscriptionResponse;
import com.houseofvelo.api.model.Player;
import com.houseofvelo.api.model.SessionTypeOption;
import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import com.houseofvelo.api.model.User;
import com.houseofvelo.api.repository.PlayerRepository;
import com.houseofvelo.api.repository.SessionTypeOptionRepository;
import com.houseofvelo.api.repository.SubscriptionRepository;
import com.houseofvelo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final SessionTypeOptionRepository sessionTypeOptionRepository;

    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request, Long userId) {
        // Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Validate playerId is provided
        if (request.getPlayerId() == null) {
            throw new IllegalArgumentException("Player ID is required for subscriptions");
        }

        // Validate player exists and belongs to this user
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found: " + request.getPlayerId()));

        // Check ownership: player can be owned via parent_id (for kids) or user_id (for independent players)
        boolean isParentPlayer = playerRepository.findByParentId(userId).stream()
                .anyMatch(p -> p.getId().equals(request.getPlayerId()));
        boolean isOwnPlayer = playerRepository.findByUserId(userId)
                .map(p -> p.getId().equals(request.getPlayerId()))
                .orElse(false);

        if (!isParentPlayer && !isOwnPlayer) {
            throw new IllegalStateException("Player does not belong to this user");
        }

        // Validate session type option
        SessionTypeOption sessionTypeOption = sessionTypeOptionRepository.findById(request.getSessionTypeOptionId())
                .orElseThrow(() -> new RuntimeException("Session type option not found: " + request.getSessionTypeOptionId()));

        // Check if player already has an active subscription for this session type option
        subscriptionRepository.findByPlayerIdAndSessionTypeOptionIdAndStatus(
                request.getPlayerId(),
                request.getSessionTypeOptionId(),
                SubscriptionStatus.ACTIVE
        ).ifPresent(s -> {
            throw new IllegalStateException("Player already has an active subscription for this program");
        });

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlayer(player);
        subscription.setSessionTypeOption(sessionTypeOption);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setTokensPerPeriod(request.getTokensPerPeriod());
        subscription.setTokensRemaining(request.getTokensPerPeriod());
        subscription.setAutoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : true);
        subscription.setCurrentPeriodStart(LocalDate.now());
        subscription.setCurrentPeriodEnd(LocalDate.now().plusDays(28));

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        log.info("Subscription created for player {} (user {}). Program: {}. Tokens: {}",
                player.getName(), userId, sessionTypeOption.getName(), savedSubscription.getTokensRemaining());

        return SubscriptionResponse.fromSubscription(savedSubscription);
    }

    public List<SubscriptionResponse> getMySubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId).stream()
                .map(SubscriptionResponse::fromSubscription)
                .collect(Collectors.toList());
    }

    public List<SubscriptionResponse> getActiveSubscriptions(Long userId) {
        return subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE).stream()
                .map(SubscriptionResponse::fromSubscription)
                .collect(Collectors.toList());
    }

    public List<SubscriptionResponse> getPlayerSubscriptions(Long playerId) {
        return subscriptionRepository.findByPlayerId(playerId).stream()
                .map(SubscriptionResponse::fromSubscription)
                .collect(Collectors.toList());
    }
}
