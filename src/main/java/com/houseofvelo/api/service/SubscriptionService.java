package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.SubscriptionRequest;
import com.houseofvelo.api.dto.SubscriptionResponse;
import com.houseofvelo.api.model.SessionTypeOption;
import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import com.houseofvelo.api.model.User;
import com.houseofvelo.api.repository.SessionTypeOptionRepository;
import com.houseofvelo.api.repository.SubscriptionRepository;
import com.houseofvelo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SessionTypeOptionRepository sessionTypeOptionRepository;

    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request, Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        SessionTypeOption sessionTypeOption = sessionTypeOptionRepository.findById(request.getSessionTypeOptionId())
                .orElseThrow(() -> new RuntimeException("Session type option not found: " + request.getSessionTypeOptionId()));


        // Check if user already has an active sub
        subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .ifPresent(s -> {
                    throw new IllegalStateException("User already has an active subscription");
                });

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setSessionTypeOption(sessionTypeOption);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setTokensPerPeriod(request.getTokensPerPeriod());
        subscription.setTokensRemaining(request.getTokensPerPeriod());
        subscription.setAutoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : true);
        subscription.setCurrentPeriodStart(LocalDate.now());
        subscription.setCurrentPeriodEnd(LocalDate.now().plusDays(28));

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        log.info("Subscription created for user {}. Tokens: {}", userId, savedSubscription.getTokensRemaining());

        return SubscriptionResponse.fromSubscription(savedSubscription);
    }

    public SubscriptionResponse getMySubscription(Long userId){
        Subscription subscription = subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        return SubscriptionResponse.fromSubscription(subscription);


    }

    public List<SubscriptionResponse> getMySubscriptions(Long userId){
        return subscriptionRepository.findByUserId(userId).stream()
                .map(SubscriptionResponse::fromSubscription)
                .collect(Collectors.toList());
    }
}
