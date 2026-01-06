package com.houseofvelo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who's booking?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional: Which player? (If parent booking for child and they have multiple)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    private Player player;

    // What are they booking?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_type_option_id", nullable = false)
    private SessionTypeOption sessionTypeOption;

    // Who's training?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    // When?
    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    // Duration (copied from session type for convenience)
    @Column(nullable = false)
    private Integer durationMinutes;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;

    // Pricing (captured at booking time - price might change later)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePaid;

    // Payment tracking
    @Column(length = 100)
    private String paymentIntentId;

    // Cancellation tracking
    private LocalDateTime cancelledAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;


}
