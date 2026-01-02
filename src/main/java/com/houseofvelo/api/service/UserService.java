package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.AuthResponse;
import com.houseofvelo.api.dto.LoginRequest;
import com.houseofvelo.api.dto.SignupRequest;
import com.houseofvelo.api.exception.InvalidCredentialsException;
import com.houseofvelo.api.exception.UserAlreadyExistsException;
import com.houseofvelo.api.model.Player;
import com.houseofvelo.api.model.Role;
import com.houseofvelo.api.model.User;
import com.houseofvelo.api.repository.PlayerRepository;
import com.houseofvelo.api.repository.UserRepository;
import com.houseofvelo.api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request){
        //check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(("Email is already registered"));
        }

        //create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // Save user to database
        User savedUser = userRepository.save(user);


        // Auto-create Player for PLAYER role
        if (request.getRole() == Role.PLAYER){
            Player player = new Player();
            player.setUser(savedUser);
            player.setParent(null);
            player.setName(savedUser.getName());
            player.setAge(request.getAge());
            player.setPosition(request.getPosition());
            player.setSport(request.getSport());
            player.setBats(request.getBats());
            player.setThrowingHand(request.getThrowingHand());

            playerRepository.save(player);
        }

        /* Auto-create Trainer for TRAINER role
        if (request.getRole() == Role.TRAINER){
            Trainer trainer = new Trainer();
            trainer.setUser(savedUser);
            trainer.setBio(request.getBio());
            trainer.setSport(request.getSport());

            trainerRepository.save(trainer);
        }
        */
        // Generate JWT Token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

        // Return response
        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole(),
                savedUser.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        //Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        //Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // Return response
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getId()
        );
    }

}
