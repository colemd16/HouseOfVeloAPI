package com.houseofvelo.api.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
public class PaymentFailedException extends RuntimeException {

    private final String errorCode;
    private final String errorDetail;

    public PaymentFailedException(String message) {
        super(message);
        this.errorCode = "PAYMENT_ERROR";
        this.errorDetail = message;
    }

    public PaymentFailedException(String errorCode, String errorDetail){
        super(errorDetail);
        this.errorCode = errorCode;
        this.errorDetail = errorDetail;
    }
}
