package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Sport;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTrainerRequest {
    private String bio;

    @NotEmpty(message = "At least one sport is required")
    private Set<Sport> sports;

    private Boolean isActive = true;
}
