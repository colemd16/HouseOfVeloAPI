package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Payment;
import com.houseofvelo.api.model.PaymentMethod;
import com.houseofvelo.api.model.PaymentStatus;
import com.squareup.square.SquareClient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long userId;
    private Long bookingId;
    private String squarePaymentId;
    private PaymentStatus status;
    private PaymentMethod method;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public static PaymentResponse fromPayment(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setUserId(payment.getUser().getId());
        response.setBookingId(payment.getBooking() != null ? payment.getBooking().getId() : null);
        response.setSquarePaymentId(payment.getSquarePaymentId());
        response.setStatus(payment.getStatus());
        response.setMethod(payment.getMethod());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setPaidAt(payment.getPaidAt());
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }

}
