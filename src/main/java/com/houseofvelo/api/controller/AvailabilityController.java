package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.AvailabilityResponse;
import com.houseofvelo.api.dto.CreateAvailabilityRequest;
import com.houseofvelo.api.dto.UpdateAvailabilityRequest;
import com.houseofvelo.api.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // Trainer adds availability slot
    @PostMapping("/me/availability")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AvailabilityResponse> addAvailability(@Valid @RequestBody CreateAvailabilityRequest request){
        Long userId = getCurrentUserId();
        AvailabilityResponse response = availabilityService.addAvailability(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Trainer views own availability
    @GetMapping("/me/availability")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<AvailabilityResponse>> getMyAvailability(){
        Long userId = getCurrentUserId();
        List<AvailabilityResponse> availability = availabilityService.getMyAvailability(userId);
        return ResponseEntity.ok(availability);
    }

    // Public views trainers availability
    @GetMapping("/{trainerId}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getTrainerAvailability(@PathVariable Long trainerId){
        List<AvailabilityResponse> availability = availabilityService.getTrainerAvailability(trainerId);
        return ResponseEntity.ok(availability);
    }

    // Trainer updates availability slot
    @PutMapping("/me/availability/{id}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AvailabilityResponse> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAvailabilityRequest request
    ) {
        Long userId = getCurrentUserId();
        AvailabilityResponse response = availabilityService.updateAvailability(id, userId, request);
        return ResponseEntity.ok(response);
    }

    // Trainer deletes availability slot
    @DeleteMapping("/me/availability/{id}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id){
        Long userId = getCurrentUserId();
        availabilityService.deleteAvailability(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Helper method
    private Long getCurrentUserId(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getCredentials();
    }
}
