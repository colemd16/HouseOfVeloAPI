package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.SessionTypeOption;
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
    private Long playerId;
    private String playerName;
    private Long sessionTypeOptionId;
    private String sessionTypeName;
    private String sessionTypeOptionName;
    private SubscriptionStatus status;
    private Integer tokensPerPeriod;
    private Integer tokensRemaining;
    private Boolean autoRenew;
    private LocalDate currentPeriodStart;
    private LocalDate currentPeriodEnd;
    private LocalDateTime createdAt;

    public static SubscriptionResponse fromSubscription(Subscription subscription) {
        SessionTypeOption option = subscription.getSessionTypeOption();
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .userId(subscription.getUser().getId())
                .playerId(subscription.getPlayer().getId())
                .playerName(subscription.getPlayer().getName())
                .sessionTypeOptionId(option != null ? option.getId() : null)
                .sessionTypeName(option != null && option.getSessionType() != null ?
                        option.getSessionType().getName() : null)
                .sessionTypeOptionName(option != null ? option.getName() : null)
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
