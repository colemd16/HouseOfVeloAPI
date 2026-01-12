package com.houseofvelo.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;

import java.time.LocalDateTime;

@Entity
@Table(name = "token_transactions")
public class TokenTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Subscription subscription;

    @ManyToOne
    private Booking booking; // nullable -> only set when using token for booking

    @Enumerated(EnumType.STRING)
    private TokenTransactionType type; // GRANTED, USED, RETURNED, EXPIRED

    private Integer amount;
    private Integer balanceAfter;

    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
