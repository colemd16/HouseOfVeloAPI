package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.PricingType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionTypeOptionRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Pricing type is required")
    private PricingType pricingType;

    // Subscription fields (required if pricingType = SUBSCRIPTION)
    private Integer billingPeriodDays;
    private Integer sessionsPerWeek;
    private Boolean autoRenew;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Must allow at least 1 participant")
    private Integer maxParticipants;
}
