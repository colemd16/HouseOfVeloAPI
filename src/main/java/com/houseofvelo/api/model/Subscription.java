package com.houseofvelo.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private SessionTypeOption sessionTypeOption;

    private String squareSubscriptionId;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status; // ACTIVE, CANCELLED, PAUSED, EXPIRED

    private LocalDate currentPeriodStart;
    private LocalDate getCurrentPeriodEnd;

    private Integer tokensPerPeriod;
    private Integer tokensRemaining;

    private Boolean autoRenew;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


}
