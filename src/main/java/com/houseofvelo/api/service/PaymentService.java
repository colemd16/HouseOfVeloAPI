package com.houseofvelo.api.service;

import com.houseofvelo.api.config.SquareProperties;
import com.houseofvelo.api.dto.PaymentResponse;
import com.houseofvelo.api.dto.ProcessPaymentRequest;
import com.houseofvelo.api.exception.BookingNotFoundException;
import com.houseofvelo.api.exception.UnauthorizedAccessException;
import com.houseofvelo.api.model.*;
import com.houseofvelo.api.repository.BookingRepository;
import com.houseofvelo.api.repository.PaymentRepository;
import com.squareup.square.SquareClient;
import com.squareup.square.types.CreatePaymentRequest;
import com.squareup.square.types.CreatePaymentResponse;
import com.squareup.square.types.Currency;
import com.squareup.square.types.Money;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // 5. Process card payment via Square
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

            // Get Square payment ID
            String squarePaymentId = response.getPayment().get().getId().orElseThrow(null);
            String paymentStatus = response.getPayment().get().getStatus().orElseThrow(null);

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

        } catch (Exception e) {
            log.error("Square payment failed for booking {}: {}", booking.getId(), e.getMessage());

            // Update booking status to failed

            bookingRepository.save(booking);

            throw new RuntimeException("Payment failed: " + e.getMessage(), e);
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
}
