package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.PaymentResponse;
import com.houseofvelo.api.dto.ProcessPaymentRequest;
import com.houseofvelo.api.dto.ReceivePaymentRequest;
import com.houseofvelo.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PARENT', 'PLAYER')")
    public ResponseEntity<PaymentResponse> processPayment(
            Authentication authentication,
            @RequestBody ProcessPaymentRequest request
            ){
        Long userId = (Long) authentication.getCredentials();
        PaymentResponse response = paymentService.processPayment(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PARENT', 'PLAYER')")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(
            Authentication authentication
    ){
        Long userId = (Long) authentication.getCredentials();
        List<PaymentResponse> payments = paymentService.getMyPayments(userId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('PARENT','PLAYER')")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(
            Authentication authentication,
            @PathVariable Long bookingId
    ) {
        Long userId = (Long) authentication.getCredentials();
        PaymentResponse payment = paymentService.getPaymentByBooking(bookingId, userId);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{paymentId}/receive")
    @PreAuthorize("hasAnyRole('TRAINER','ADMIN')")
    public ResponseEntity<PaymentResponse> receivePayment(
            Authentication authentication,
            @PathVariable Long paymentId,
            @RequestBody
            ReceivePaymentRequest request
    ){
        Long userId = (Long) authentication.getCredentials();
        PaymentResponse response = paymentService.receivePayment(paymentId, request.getMethod(), userId);
        return ResponseEntity.ok(response);
    }

}
