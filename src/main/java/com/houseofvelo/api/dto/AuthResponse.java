package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String email;
    private String name;
    private Role role;
    private Long userId;
}
