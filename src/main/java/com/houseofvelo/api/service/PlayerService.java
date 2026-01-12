package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.CreatePlayerRequest;
import com.houseofvelo.api.dto.PlayerResponse;
import com.houseofvelo.api.dto.UpdatePlayerRequest;
import com.houseofvelo.api.exception.PlayerNotFoundException;
import com.houseofvelo.api.exception.UnauthorizedAccessException;
import com.houseofvelo.api.model.Player;
import com.houseofvelo.api.model.User;
import com.houseofvelo.api.repository.PlayerRepository;
import com.houseofvelo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;

    @Transactional
    public PlayerResponse createPlayer(CreatePlayerRequest request, Long parentId){

        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create new player
        Player player = new Player();
        player.setParent(parent);
        player.setName(request.getName());
        player.setAge(request.getAge());
        player.setPosition(request.getPosition());
        player.setSport(request.getSport());
        player.setBats(request.getBats());
        player.setThrowingHand(request.getThrowingHand());
        player.setImageUrl(request.getImageUrl());

        Player savedPlayer = playerRepository.save(player);
        return PlayerResponse.fromPlayer(savedPlayer);
    }

    public List<PlayerResponse> getMyPlayers(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Player> players;

        // If independent player, find their own player record
        if (user.getRole().name().equals("PLAYER")){
            players = playerRepository.findByUserId(userId)
                    .map(List::of)
                    .orElse(List.of());
        }
        else {
            players = playerRepository.findByParentId(userId);
        }

        return players.stream()
                .map(PlayerResponse::fromPlayer)
                .collect(Collectors.toList());
    }

    public PlayerResponse getPlayerById(Long playerId, Long userId){
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with id: " + playerId));

        // Check authorization
        if (!canAccessPlayer(player, userId)){
            throw new UnauthorizedAccessException("You dont have the permission to access this player");
        }

        return PlayerResponse.fromPlayer(player);
    }

    @Transactional
    public PlayerResponse updatePlayer(Long playerId, UpdatePlayerRequest request, Long userId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with id: " + playerId));

        // check authorization
        if (!canAccessPlayer(player, userId)){
            throw new UnauthorizedAccessException("You dont have the permission to update this player");
        }

        //update only non null fields
        if (request.getName() != null){
            player.setName(request.getName());
        }
        if (request.getAge() != null){
            player.setAge(request.getAge());
        }
        if (request.getPosition() != null){
            player.setPosition(request.getPosition());
        }
        if (request.getSport() != null){
            player.setSport(request.getSport());
        }
        if (request.getBats() != null){
            player.setBats(request.getBats());
        }
        if (request.getThrowingHand() != null){
            player.setThrowingHand(request.getThrowingHand());
        }
        if (request.getImageUrl() != null){
            player.setImageUrl(request.getImageUrl());
        }

        Player updatedPlayer = playerRepository.save(player);
        return PlayerResponse.fromPlayer(updatedPlayer);

    }

    @Transactional
    public void deletePlayer(Long playerId, Long userId){
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with id: " + playerId));

        // Check authorization
        if (!canAccessPlayer(player, userId)){
            throw new UnauthorizedAccessException("You don't have permission to delete this player");
        }

        playerRepository.delete(player);
    }

    // Helper method to check if user can access this player
    private boolean canAccessPlayer(Player player, Long userId){
        if (player.getUser() != null){
            return player.getUser().getId().equals(userId);
        }

        // Parent managed player - only parent can access
        if (player.getParent() != null){
            return player.getParent().getId().equals(userId);
        }

        return false;
    }


}
