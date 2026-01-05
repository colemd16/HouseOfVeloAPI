package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Sport;
import com.houseofvelo.api.model.Trainer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerResponse {

    private Long id;
    private Long userId;
    private String name;
    private String bio;
    private Set<Sport> sports;
    private String imageUrl;
    private String createdAt;
    private String updatedAt;

    // Helper method to convert Trainer entity to Response DTO
    public static TrainerResponse fromTrainer(Trainer trainer){
        TrainerResponse response = new TrainerResponse();
        response.setId(trainer.getId());
        response.setUserId(trainer.getUser().getId());
        response.setName(trainer.getUser().getName());
        response.setBio(trainer.getBio());
        response.setSports(trainer.getSports());
        response.setImageUrl(trainer.getImageUrl());
        response.setCreatedAt(trainer.getCreatedAt().toString());
        response.setUpdatedAt(trainer.getUpdatedAt().toString());
        return response;
    }
}
