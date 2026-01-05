package com.houseofvelo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_type_options")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionTypeOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_type_id", nullable = false)
    private SessionType sessionType;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PricingType pricingType; // ONE_TIME or SUBSCRIPTION

    // Subscription specific fields - null for ONE_TIME
    @Column
    private Integer billingPeriodDays;

    @Column
    private Integer sessionsPerWeek;

    @Column
    private Boolean autoRenew;

    // General fields
    @Column(nullable = false)
    private Integer maxParticipants;

    @Column(nullable = false)
    private Boolean isActive;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isSubscription() {
        return pricingType == PricingType.SUBSCRIPTION;
    }

    public boolean isOneTime() {
        return pricingType == PricingType.ONE_TIME;
    }


}
