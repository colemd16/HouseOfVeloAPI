package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.AvailabilityResponse;
import com.houseofvelo.api.dto.CreateAvailabilityRequest;
import com.houseofvelo.api.dto.UpdateAvailabilityRequest;
import com.houseofvelo.api.exception.AvailabilityNotFoundException;
import com.houseofvelo.api.exception.TrainerNotFoundException;
import com.houseofvelo.api.exception.UnauthorizedAccessException;
import com.houseofvelo.api.model.Trainer;
import com.houseofvelo.api.model.TrainerAvailability;
import com.houseofvelo.api.repository.AvailabilityRepository;
import com.houseofvelo.api.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final TrainerRepository trainerRepository;

    @Transactional
    public AvailabilityResponse addAvailability(Long userId, CreateAvailabilityRequest request){
        // Find trainer by user ID
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        // Validate times
        if (request.getEndTime().isBefore(request.getStartTime()) ||
        request.getEndTime().equals(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Create availability slot
        TrainerAvailability availability = new TrainerAvailability();
        availability.setTrainer(trainer);
        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setIsAvailable(true);

        TrainerAvailability saved = availabilityRepository.save(availability);
        return AvailabilityResponse.fromAvailability(saved);
    }

    public List<AvailabilityResponse> getMyAvailability(Long userId){
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        return availabilityRepository.findByTrainerId(trainer.getId())
                .stream()
                .map(AvailabilityResponse::fromAvailability)
                .collect(Collectors.toList());
    }

    public List<AvailabilityResponse> getTrainerAvailability(Long trainerId){
        // Public endpoint - anyone can view trainer's schedule
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found with id: " + trainerId));

        return availabilityRepository.findByTrainerId(trainerId)
                .stream()
                .map(AvailabilityResponse::fromAvailability)
                .collect(Collectors.toList());
    }

    @Transactional
    public AvailabilityResponse updateAvailability(Long availabilityId, Long userId, UpdateAvailabilityRequest request) {
        TrainerAvailability availability = availabilityRepository.findById(userId)
                .orElseThrow(() -> new AvailabilityNotFoundException("Availability not found with id: " + availabilityId));

        // Check ownership - only the trainer who owns this slot can update it
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        if (!availability.getTrainer().getId().equals(trainer.getId())){
            throw new UnauthorizedAccessException("You don't have permission to update this availability");
        }

        // Update only non-null fields
        if (request.getDayOfWeek() != null){
            availability.setDayOfWeek(request.getDayOfWeek());
        }

        if (request.getStartTime() != null){
            availability.setStartTime(request.getStartTime());
        }

        if (request.getEndTime() != null){
            availability.setEndTime(request.getEndTime());
        }

        if (request.getIsAvailable() != null){
            availability.setIsAvailable(request.getIsAvailable());
        }

        // Validate times if both are present
        if (availability.getEndTime().isBefore(availability.getStartTime()) ||
                availability.getEndTime().equals(availability.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        TrainerAvailability updated = availabilityRepository.save(availability);
        return AvailabilityResponse.fromAvailability(updated);
    }

    @Transactional
    public void deleteAvailability(Long availabilityId, Long userId) {
        TrainerAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new AvailabilityNotFoundException("Availability not found"));

        // Check ownership
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        if (!availability.getTrainer().getId().equals(trainer.getId())){
            throw new UnauthorizedAccessException("You don't have permission to delete this availability");
        }

        availabilityRepository.delete(availability);
    }
}
