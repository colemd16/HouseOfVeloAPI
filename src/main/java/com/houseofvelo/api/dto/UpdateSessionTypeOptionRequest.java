package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.PricingType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateSessionTypeOptionRequest {

    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;
    private String description;
    private BigDecimal price;
    private PricingType pricingType;
    private Integer billingPeriodDays;
    private Integer sessionsPerWeek;
    private Boolean autoRenew;

    @Min(value = 1, message = "Must allow at least 1 participant")
    private Integer maxParticipants;

    private Boolean isActive;

}
