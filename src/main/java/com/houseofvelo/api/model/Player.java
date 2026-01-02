package com.houseofvelo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // for parent-managed players (kids)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private User parent;

    // For independent players
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column
    private Integer age;

    @Column(length = 50)
    private String position;

    @Column(length = 20)
    private String sport;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Handedness bats;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Handedness throwingHand;

    @Column(length = 500)
    private String imageUrl; //profile picture w/ URL or file path

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Boolean isIndependent() {
        return user != null && parent == null;
    }

    public Boolean isParentManaged() {
        return parent != null && user == null;
    }
}
