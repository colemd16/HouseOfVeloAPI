package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.PricingType;
import com.houseofvelo.api.model.SessionTypeOption;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionTypeOptionResponse {

    private Long id;
    private Long sessionTypeId;
    private String sessionTypeName;
    private String name;
    private String description;
    private BigDecimal price;
    private PricingType pricingType;

    // Subscription fields (null for ONE_TIME)
    private Integer billingPeriodDays;
    private Integer sessionsPerWeek;
    private Boolean autoRenew;

    // General fields
    private Integer maxParticipants;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;

    public static SessionTypeOptionResponse fromOption(SessionTypeOption option){
        SessionTypeOptionResponse response = new SessionTypeOptionResponse();
        response.setId(option.getId());
        response.setSessionTypeId(option.getSessionType().getId());
        response.setSessionTypeName(option.getSessionType().getName());
        response.setName(option.getName());
        response.setDescription(option.getDescription());
        response.setPrice(option.getPrice());
        response.setPricingType(option.getPricingType());
        response.setBillingPeriodDays(option.getBillingPeriodDays());
        response.setAutoRenew(option.getAutoRenew());
        response.setMaxParticipants(option.getMaxParticipants());
        response.setIsActive(option.getIsActive());
        response.setCreatedAt(option.getCreatedAt().toString());
        response.setUpdatedAt(option.getUpdatedAt().toString());
        return response;
    }
}
