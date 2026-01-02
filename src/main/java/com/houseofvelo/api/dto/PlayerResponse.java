package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.Handedness;
import com.houseofvelo.api.model.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {

    private Long id;
    private String name;
    private Integer age;
    private String position;
    private String sport;
    private Handedness bats;
    private Handedness throwingHand;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean independent;

    public PlayerResponse fromPlayer(Player player){
        PlayerResponse response = new PlayerResponse();
        response.setId(player.getId());
        response.setName(player.getName());
        response.setAge(player.getAge());
        response.setPosition(player.getPosition());
        response.setSport(player.getSport());
        response.setBats(player.getBats());
        response.setThrowingHand(player.getThrowingHand());
        response.setImageUrl(player.getImageUrl());
        response.setCreatedAt(player.getCreatedAt());
        response.setUpdatedAt(player.getUpdatedAt());
        response.setIndependent(player.isIndependent());
        return response;
    }

}
