package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    // Find all players for a specific parent
    List<Player> findByParentId(Long parentId);

    // Find player for a specific user (independent player)
    Optional<Player> findByUserId(Long userId);

    List<Player> findAll();

}
