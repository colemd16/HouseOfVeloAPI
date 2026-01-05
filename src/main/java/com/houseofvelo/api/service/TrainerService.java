package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.TrainerResponse;
import com.houseofvelo.api.dto.UpdateTrainerRequest;
import com.houseofvelo.api.exception.TrainerNotFoundException;
import com.houseofvelo.api.model.Trainer;
import com.houseofvelo.api.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;

    // Get my trainer profile (for trainer viewing their own profile)
    public TrainerResponse getMyProfile(Long userId){
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        return TrainerResponse.fromTrainer(trainer);
    }

    // Update my trainer profile
    @Transactional
    public TrainerResponse updateMyProfile(Long userId, UpdateTrainerRequest request) {
        Trainer trainer = trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer profile not found"));

        // Update only non-null fields
        if (request.getBio() != null) {
            trainer.setBio(request.getBio());
        }
        if (request.getSports() != null){
            trainer.setSports(request.getSports());
        }
        if (request.getImageUrl() != null){
            trainer.setImageUrl(request.getImageUrl());
        }

        Trainer updatedTrainer = trainerRepository.save(trainer);
        return TrainerResponse.fromTrainer(updatedTrainer);
    }

    // Get all trainers (public - for customers to view)
    public List<TrainerResponse> getAllTrainers() {
        return trainerRepository.findAll()
                .stream()
                .map(TrainerResponse::fromTrainer)
                .collect(Collectors.toList());
    }

    // Get specific trainer by ID (public - for customer viewing trainer details)
    public TrainerResponse getTrainerById(Long trainerId){
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found"));

        return TrainerResponse.fromTrainer(trainer);

    }


}
