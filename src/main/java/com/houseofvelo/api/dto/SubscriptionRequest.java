package com.houseofvelo.api.dto;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private Long sessionTypeOptionId;
    private Long playerId; // Required - the player this subscription is for
    private Integer tokensPerPeriod;
    private Boolean autoRenew;
}
