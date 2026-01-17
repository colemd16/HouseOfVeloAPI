package com.houseofvelo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne(optional = false)
    private Player player; // The player this subscription is for

    @ManyToOne
    private SessionTypeOption sessionTypeOption;

    private String squareSubscriptionId;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status; // ACTIVE, CANCELLED, PAUSED, EXPIRED

    private LocalDate currentPeriodStart;
    private LocalDate currentPeriodEnd;

    private Integer tokensPerPeriod;
    private Integer tokensRemaining;

    private Boolean autoRenew;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


}
