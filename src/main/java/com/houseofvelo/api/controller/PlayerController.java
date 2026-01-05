package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.CreatePlayerRequest;
import com.houseofvelo.api.dto.PlayerResponse;
import com.houseofvelo.api.dto.UpdatePlayerRequest;
import com.houseofvelo.api.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Security;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody CreatePlayerRequest request){
        Long userId = getCurrentUserId();
        PlayerResponse response = playerService.createPlayer(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PlayerResponse>> getMyPlayers() {
        Long userId = getCurrentUserId();
        List<PlayerResponse> players = playerService.getMyPlayers(userId);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id){
        Long userId = getCurrentUserId();
        PlayerResponse player = playerService.getPlayerById(id, userId);
        return ResponseEntity.ok(player);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerResponse> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePlayerRequest request
    ){
        Long userId = getCurrentUserId();
        PlayerResponse player = playerService.updatePlayer(id, request, userId);
        return ResponseEntity.ok(player);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id){
        Long userId = getCurrentUserId();
        playerService.deletePlayer(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Helper method to get current user's ID from JWT
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getCredentials();
    }

}
