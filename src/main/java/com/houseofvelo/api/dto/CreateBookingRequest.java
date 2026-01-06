package com.houseofvelo.api.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "Session type option is required")
    private Long sessionTypeOptionId;

    @NotNull(message = "Trainer is required")
    private Long trainerId;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledAt;

    // Optional: if parent is booking for player
    private Long playerId;

    // Optional: Notes
    private String notes;
}
