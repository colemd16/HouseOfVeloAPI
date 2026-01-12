package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceivePaymentRequest {
    private PaymentMethod method;  // CASH or CARD_IN_PERSON
}
