package com.houseofvelo.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessPaymentRequest {

    private Long bookingId;
    private String sourceId; // Payment token from Square Web Payments SDK
    private Boolean payInPerson; // If true, skip Square payment now
    private Boolean useToken; // Pay with subscription token
}
