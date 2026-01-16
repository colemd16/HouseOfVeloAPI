package com.houseofvelo.api.dto;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private Long sessionTypeOptionId;
    private Integer tokensPerPeriod;
    private Boolean autoRenew;
}
