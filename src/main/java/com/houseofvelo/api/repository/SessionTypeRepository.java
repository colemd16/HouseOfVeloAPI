package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.SessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionTypeRepository extends JpaRepository<SessionType, Long> {

    // Find all active session types (for public view)
    List<SessionType> findByIsActiveTrue();

    // Find all session types (for admin)
    List<SessionType> findAll();
}
