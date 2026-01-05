package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Sport;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTrainerRequest {

    private String bio;
    private Set<Sport> sports;
    private String imageUrl;

}
