package com.houseofvelo.api.service;

import com.houseofvelo.api.config.SquareProperties;
import com.houseofvelo.api.dto.PaymentResponse;
import com.houseofvelo.api.dto.ProcessPaymentRequest;
import com.houseofvelo.api.dto.RefundRequest;
import com.houseofvelo.api.exception.BookingNotFoundException;
import com.houseofvelo.api.exception.PaymentFailedException;
import com.houseofvelo.api.exception.PaymentProcessingException;
import com.houseofvelo.api.exception.UnauthorizedAccessException;
import com.houseofvelo.api.model.*;
import com.houseofvelo.api.model.Booking;
import com.houseofvelo.api.model.BookingStatus;
import com.houseofvelo.api.model.Payment;
import com.houseofvelo.api.model.Subscription;
import com.houseofvelo.api.model.SubscriptionStatus;
import com.houseofvelo.api.repository.BookingRepository;
import com.houseofvelo.api.repository.PaymentRepository;
import com.houseofvelo.api.repository.SubscriptionRepository;
import com.squareup.square.SquareClient;
import com.squareup.square.core.SquareException;
import com.squareup.square.types.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.View;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SquareClient squareClient;
    private final SquareProperties squareProperties;
    private final View error;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public PaymentResponse processPayment(ProcessPaymentRequest request, Long userId) {
        // 1. Find the booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + request.getBookingId()));

        // 2. Verify user owns this booking
        if (!booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't have permission to pay for this booking");
        }

        // Check if payment already exists for the booking
        Optional<Payment> existingPayment = paymentRepository.findByBookingId(request.getBookingId());

        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            if(payment.getStatus() == PaymentStatus.COMPLETED) {
                throw new IllegalStateException("This booking has already been paid for");
            }
            if(payment.getStatus() == PaymentStatus.PENDING){
                throw new IllegalStateException("This payment is currently pending");
            }
        }

        // 4. Handle pay-in-person option
        if (Boolean.TRUE.equals(request.getPayInPerson())) {
            return createPayInPersonPayment(booking);
        }

        // 5. Handle pay with token
        if (Boolean.TRUE.equals(request.getUseToken())){
            return processTokenPayment(booking, userId);
        }

        // 6. Process card payment via Square
        return processSquarePayment(booking, request.getSourceId());
    }

    private PaymentResponse createPayInPersonPayment(Booking booking) {
        // Set payment deadline (12 hours before session)
        LocalDateTime deadline = booking.getScheduledAt().minusHours(12);

        if (deadline.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Pay-in-person is not available less than 12 hours before the session");
        }

        // Update booking
        booking.setPayInPerson(true);
        booking.setPaymentDeadline(deadline);
        bookingRepository.save(booking);

        // Create pending payment record
        Payment payment = new Payment();
        payment.setUser(booking.getUser());
        payment.setBooking(booking);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setAmount(booking.getPricePaid());
        payment.setCurrency("USD");

        Payment savedPayment = paymentRepository.save(payment);

        log.info("Pay-in-person payment created for booking {}. Deadline: {}", booking.getId(), deadline);

        return PaymentResponse.fromPayment(savedPayment);
    }

    private PaymentResponse processSquarePayment(Booking booking, String sourceId) {
        try {
            // Convert price to cents (Square uses smallest currency unit)
            Long amountInCents = booking.getPricePaid()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            // Build Square payment request
            CreatePaymentRequest squareRequest = CreatePaymentRequest.builder()
                    .sourceId(sourceId)
                    .idempotencyKey(UUID.randomUUID().toString())
                    .amountMoney(Money.builder()
                            .amount(amountInCents)
                            .currency(Currency.USD)
                            .build())
                    .locationId(squareProperties.getLocationId())
                    .referenceId(booking.getId().toString())
                    .note("House of Velo - Booking #" + booking.getId())
                    .build();

            // Call Square API
            CreatePaymentResponse response = squareClient.payments().create(squareRequest);

            // Extract payment details from response
            if (response.getPayment().isEmpty()) {
                throw new PaymentProcessingException("Square did not return payment");
            }

            // Get Square payment ID
            String squarePaymentId = response.getPayment().get().getId().orElse(null);
            String paymentStatus = response.getPayment().get().getStatus().orElse("UNKNOWN");

            log.info("Square payment response - ID: {}, Status: {}", squarePaymentId, paymentStatus);

            // Update booking
            booking.setPayInPerson(false);
            bookingRepository.save(booking);

            // Create payment record
            Payment payment = new Payment();
            payment.setUser(booking.getUser());
            payment.setBooking(booking);
            payment.setSquarePaymentId(squarePaymentId);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setMethod(PaymentMethod.CARD_ONLINE);
            payment.setAmount(booking.getPricePaid());
            payment.setCurrency("USD");
            payment.setPaidAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);

            log.info("Payment record created for booking {}. Square Payment ID: {}",
                    booking.getId(), squarePaymentId);

            return PaymentResponse.fromPayment(savedPayment);

        } catch (SquareException e) {
            log.error("Square payment failed for booking {}: {}", booking.getId(), e.getMessage());

            // Try to extract Square error details
            String errorCode = "PAYMENT_ERROR";
            String errorDetail = "Payment processing failed";
            String message = e.getMessage();

            // Parse error code from Square response message
            if (message != null) {
                if (message.contains("GENERIC_DECLINE")) {
                    errorCode = "CARD_DECLINED";
                    errorDetail = "Your card was declined. Please try again with a different payment method";
                } else if (message.contains("INSUFFICIENT_FUNDS")) {
                    errorCode = "INSUFFICIENT_FUNDS";
                    errorDetail = "Insufficient funds, please try again.";
                } else if (message.contains("CARD_EXPIRED")) {
                    errorCode = "CARD_EXPIRED";
                    errorDetail = "Your card has expired, please try a different payment method";
                } else if (message.contains("INVALID_CARD")) {
                    errorCode = "INVALID_CARD";
                    errorDetail = "Invalid card number, please use another card or try again";
                }
            }

            bookingRepository.save(booking);

            throw new PaymentFailedException(errorCode, errorDetail);

        } catch (Exception e){
            log.error("Unexpected error for booking {}: {}", booking.getId(), e.getMessage());
            throw new PaymentFailedException("PAYMENT_ERROR", "An unexpected error occurred");
        }
    }

    public List<PaymentResponse> getMyPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PaymentResponse::fromPayment)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentByBooking(Long bookingId, Long userId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + bookingId));

        if (!payment.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't have permission to view this payment");
        }

        return PaymentResponse.fromPayment(payment);
    }

    @Transactional
    public PaymentResponse receivePayment(Long paymentId, PaymentMethod method, Long staffUserId){
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        // Verify payment is pending
        if (payment.getStatus() != PaymentStatus.PENDING){
            throw new IllegalStateException("Payment is not pending. Current status: " + payment.getStatus());
        }

        // Verify its a pay-in-person payment
        if (!Boolean.TRUE.equals(payment.getBooking().getPayInPerson())){
            throw new IllegalStateException("This is not a pay-in-person payment");
        }

        // Validate payment method for in-person
        if (method != PaymentMethod.CARD_IN_PERSON && method != PaymentMethod.CASH){
            throw new IllegalArgumentException("In-person payments must be cash or card");
        }

        // Update payment
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setMethod(method);
        payment.setPaidAt(LocalDateTime.now());

        // Update booking
        Booking booking = payment.getBooking();
        bookingRepository.save(booking);

        Payment savedPayment = paymentRepository.save(payment);

        log.info("Payment {} received. Method: {}, Amount: ${}",
                paymentId, method, payment.getAmount());

        return PaymentResponse.fromPayment(savedPayment);

    }

    public PaymentResponse refundPayment(Long paymentId, String reason, Long staffUserId){
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        // Verify payment is completed (can only refund completed payments)
        if (payment.getStatus() != PaymentStatus.COMPLETED){
            throw new IllegalStateException("Can only refund completed payments, current payment is categorized as : " + payment.getStatus());
        }

        // If it was an online card payment, process refund through square
        if (payment.getMethod() == PaymentMethod.CARD_ONLINE && payment.getSquarePaymentId() != null){
            processSquareRefund(payment);
        }

        // Update payment record
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundReason(reason);
        payment.setRefundedAt(LocalDateTime.now());

        // Update booking status to cancelled
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason("Payment refunded: " + reason);
        booking.setCancelledAt(LocalDateTime.now());
        bookingRepository.save(booking);

        Payment savedPayment = paymentRepository.save(payment);

        log.info("Payment {} refunded. Reason: {}, Method: {}", payment, reason, payment.getMethod());

        return PaymentResponse.fromPayment(savedPayment);
    }

    private void processSquareRefund(Payment payment){

        try{
            // Build Money object for the refund amount
            Long amountInCents = payment.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

            // Build the RefundPaymentRequest
            RefundPaymentRequest refundRequest = RefundPaymentRequest.builder()
                    .idempotencyKey(UUID.randomUUID().toString())
                    .amountMoney(Money.builder()
                            .amount(amountInCents)
                            .currency(Currency.USD)
                            .build())
                    .paymentId(payment.getSquarePaymentId())
                    .reason("House of Velo Refund - Booking #" + payment.getBooking().getId())
                    .build();

            // Call the Refund Payment API
            PaymentRefund refund = squareClient.refunds()
                    .refundPayment(refundRequest)
                    .getRefund()
                            .orElseThrow(() -> new RuntimeException("Could not obtain refund from API"));

            payment.setSquareRefundId(refund.getId());

            log.info("Square refund processed. Refund ID: {}", refund.getId());

        } catch(SquareException e) {
            log.error("Square refund failed: {}", e.getMessage());
            throw new PaymentFailedException("REFUND_FAILED", "Failed to process refund");
        } catch (Exception e){
            log.error("Unexpected error during refund: {}", e.getMessage());
            throw new PaymentFailedException("REFUND_FAILED", "An unexpected error occured during refund process");
        }
    }

    // Helper method to process token payments
    public PaymentResponse processTokenPayment(Booking booking, Long userId){
        // Find active subs with tokens
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatusAndTokensRemainingGreaterThan(userId, SubscriptionStatus.ACTIVE, 0)
                .orElseThrow(() -> new IllegalStateException("No active subscription with available tokens"));

        // Deduct token
        subscription.setTokensRemaining(subscription.getTokensRemaining() - 1);
        subscriptionRepository.save(subscription);

        // Link booking to subscription
        booking.setSubscription(subscription);
        booking.setPayInPerson(false);
        bookingRepository.save(booking);

        // Create completed payment
        Payment payment = new Payment();
        payment.setUser(booking.getUser());
        payment.setBooking(booking);
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setMethod(PaymentMethod.TOKEN);
        payment.setAmount(booking.getPricePaid());
        payment.setCurrency("USD");
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        log.info("Token payment processed for booking {}. Tokens remaining: {}",
                booking.getId(), subscription.getTokensRemaining());

        return PaymentResponse.fromPayment(savedPayment);
    }
}
