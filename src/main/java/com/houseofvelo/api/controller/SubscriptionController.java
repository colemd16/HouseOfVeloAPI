package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.SubscriptionRequest;
import com.houseofvelo.api.dto.SubscriptionResponse;
import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.repository.SubscriptionRepository;
import com.houseofvelo.api.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PARENT','PLAYER')")
    public ResponseEntity<SubscriptionResponse> createSubscription(
            Authentication authentication,
            @RequestBody SubscriptionRequest request
            ){
        Long userId = (Long) authentication.getCredentials();
        SubscriptionResponse response = subscriptionService.createSubscription(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('PARENT','PLAYER')")
    public ResponseEntity<List<SubscriptionResponse>> getActiveSubscriptions(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        List<SubscriptionResponse> subscriptions = subscriptionService.getActiveSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PARENT', 'PLAYER')")
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        List<SubscriptionResponse> subscriptions = subscriptionService.getMySubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }
}
