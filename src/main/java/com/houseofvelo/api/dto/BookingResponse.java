package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Booking;
import com.houseofvelo.api.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String playerName;
    private Long sessionTypeOptionId;
    private String sessionTypeName;
    private String sessionTypeOptionName;
    private Long trainerId;
    private String trainerName;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private BookingStatus status;
    private BigDecimal pricePaid;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String cancellationReason;

    public static BookingResponse fromBooking(Booking booking){
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getName());

        // Player info (optional)
        if (booking.getPlayer() != null){
            response.setPlayerId(booking.getPlayer().getId());
            response.setPlayerName(booking.getPlayer().getName());
        }

        // Session info
        response.setSessionTypeOptionId(booking.getSessionTypeOption().getId());
        response.setSessionTypeName(booking.getSessionTypeOption().getSessionType().getName());
        response.setSessionTypeOptionName(booking.getSessionTypeOption().getName());

        // Trainer info
        response.setTrainerId(booking.getTrainer().getId());
        response.setTrainerName(booking.getTrainer().getUser().getName());

        // Booking details
        response.setScheduledAt(booking.getScheduledAt());
        response.setDurationMinutes(booking.getDurationMinutes());
        response.setStatus(booking.getStatus());
        response.setPricePaid(booking.getPricePaid());
        response.setNotes(booking.getNotes());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        response.setCancellationReason(booking.getCancellationReason());

        return response;
    }

    private void setPlayerId(Long id) {
    }
}
