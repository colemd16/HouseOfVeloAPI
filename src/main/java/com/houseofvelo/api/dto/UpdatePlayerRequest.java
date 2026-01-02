package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Handedness;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlayerRequest {

    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    private Integer age;

    @Size(max = 50, message = "Position cannot exceed 50 characters")
    private String position;

    @Size(max = 20, message = "Sport cannot exceed 20 characters")
    private String sport;

    private Handedness bats;

    private Handedness throwingHand;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;
}
