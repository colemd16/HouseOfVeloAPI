package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.AuthResponse;
import com.houseofvelo.api.dto.LoginRequest;
import com.houseofvelo.api.dto.SignupRequest;
import com.houseofvelo.api.model.User;
import com.houseofvelo.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request){
        AuthResponse response = userService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@Valid @RequestBody LoginRequest request){
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

     
}
