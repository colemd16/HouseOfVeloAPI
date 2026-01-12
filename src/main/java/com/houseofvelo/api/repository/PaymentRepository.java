package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Payment;
import com.houseofvelo.api.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findBySquarePaymentId(String squarePaymentId);

    List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);
}
