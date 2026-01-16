package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SubscriptionResponse {
    private Long id;
    private Long userId;
    private Long sessionTypeOptionId;
    private SubscriptionStatus status;
    private Integer tokensPerPeriod;
    private Integer tokensRemaining;
    private Boolean autoRenew;
    private LocalDate currentPeriodStart;
    private LocalDate currentPeriodEnd;
    private LocalDateTime createdAt;

    public static SubscriptionResponse fromSubscription(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .userId(subscription.getUser().getId())
                .sessionTypeOptionId(subscription.getSessionTypeOption() != null ?
                        subscription.getSessionTypeOption().getId() : null)
                .status(subscription.getStatus())
                .tokensPerPeriod(subscription.getTokensPerPeriod())
                .tokensRemaining(subscription.getTokensRemaining())
                .autoRenew(subscription.getAutoRenew())
                .currentPeriodStart(subscription.getCurrentPeriodStart())
                .currentPeriodEnd(subscription.getCurrentPeriodEnd())
                .createdAt(subscription.getCreatedAt())
                .build();
    }
}
