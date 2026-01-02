package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Handedness;
import com.houseofvelo.api.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be atleast 8 characters")
    private String password;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    // Optional player fields (only for role = PLAYER)
    private Integer age;
    private String position;
    private String sport;
    private Handedness bats;
    private Handedness throwingHand;
    private String imageUrl;

    //optional trainer field
    private String bio;

}
