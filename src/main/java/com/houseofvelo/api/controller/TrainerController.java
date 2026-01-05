package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.TrainerResponse;
import com.houseofvelo.api.dto.UpdateTrainerRequest;
import com.houseofvelo.api.model.Trainer;
import com.houseofvelo.api.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    // Public endpoint - anyone can view all trainers
    public ResponseEntity<List<TrainerResponse>> getAllTrainers() {
        List<TrainerResponse> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    // Public endpoint - anyone can view specific trainer
    @GetMapping("/{id}")
    public ResponseEntity<TrainerResponse> getTrainerById(@PathVariable Long id){
        TrainerResponse trainer = trainerService.getTrainerById(id);
        return ResponseEntity.ok(trainer);
    }

    // Protected endpoint - trainer views own profile
    @GetMapping("/me")
    public ResponseEntity<TrainerResponse> getMyProfile() {
        Long userId = getCurrentUserId();
        TrainerResponse trainer = trainerService.getMyProfile(userId);
        return ResponseEntity.ok(trainer);
    }

    // Protected endpoint - trainer updates own profile
    @PutMapping("/me")
    public ResponseEntity<TrainerResponse> updateMyProfile(@Valid @RequestBody UpdateTrainerRequest request) {
        Long userId = getCurrentUserId();
        TrainerResponse trainer = trainerService.updateMyProfile(userId, request);
        return ResponseEntity.ok(trainer);
    }

    // Helper method to get current users id from JWT
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getCredentials();
    }

}
