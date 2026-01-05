package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.TrainerAvailability;
import com.houseofvelo.api.repository.AvailabilityRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {

    private Long id;
    private Long trainerId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
    private String createdAt;
    private String updatedAt;

    // Helper method to convert entity to DTO

    public static AvailabilityResponse fromAvailability(TrainerAvailability availability){
        AvailabilityResponse response = new AvailabilityResponse();
        response.setId(availability.getId());
        response.setTrainerId(availability.getTrainer().getId());
        response.setDayOfWeek(availability.getDayOfWeek());
        response.setStartTime(availability.getStartTime());
        response.setEndTime(availability.getEndTime());
        response.setIsAvailable(availability.getIsAvailable());
        response.setCreatedAt(availability.getCreatedAt().toString());
        response.setUpdatedAt(availability.getUpdatedAt().toString());
        return response;
    }
}
