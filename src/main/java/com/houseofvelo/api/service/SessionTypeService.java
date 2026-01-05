package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.CreateSessionTypeRequest;
import com.houseofvelo.api.dto.SessionTypeResponse;
import com.houseofvelo.api.dto.UpdateSessionTypeRequest;
import com.houseofvelo.api.exception.SessionTypeNotFoundException;
import com.houseofvelo.api.model.SessionType;
import com.houseofvelo.api.repository.SessionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionTypeService {

    private final SessionTypeRepository sessionTypeRepository;

    // PUBLIC: Get all active session types (customers view this)
    public List<SessionTypeResponse> getAllActiveSessionTypes() {
        return sessionTypeRepository.findByIsActiveTrue()
                .stream()
                .map(sessionType -> SessionTypeResponse.fromSessionType(sessionType, false))  // Don't include options in list view
                .collect(Collectors.toList());
    }

    // PUBLIC: Get specific session type (includes options)
    public SessionTypeResponse getSessionTypeById(Long id) {
        SessionType sessionType = sessionTypeRepository.findById(id)
                .orElseThrow(() -> new SessionTypeNotFoundException("Session type not found with id: " + id));

        return SessionTypeResponse.fromSessionType(sessionType, true);  // Include options in detail view
    }

    // ADMIN: Get all session types (including inactive)
    public List<SessionTypeResponse> getAllSessionTypes() {
        return sessionTypeRepository.findAll()
                .stream()
                .map(sessionType -> SessionTypeResponse.fromSessionType(sessionType, false))  // Don't include options in list view
                .collect(Collectors.toList());
    }

    // ADMIN: Create session type
    @Transactional
    public SessionTypeResponse createSessionType(CreateSessionTypeRequest request) {
        SessionType sessionType = new SessionType();
        sessionType.setName(request.getName());
        sessionType.setDescription(request.getDescription());
        sessionType.setDurationMinutes(request.getDurationMinutes());
        sessionType.setIsActive(true);  // New session types default to active

        SessionType saved = sessionTypeRepository.save(sessionType);
        return SessionTypeResponse.fromSessionType(saved, false);
    }

    // ADMIN: Update session type
    @Transactional
    public SessionTypeResponse updateSessionType(Long id, UpdateSessionTypeRequest request) {
        SessionType sessionType = sessionTypeRepository.findById(id)
                .orElseThrow(() -> new SessionTypeNotFoundException("Session type not found with id: " + id));

        // Update only non-null fields
        if (request.getName() != null) {
            sessionType.setName(request.getName());
        }
        if (request.getDescription() != null) {
            sessionType.setDescription(request.getDescription());
        }
        if (request.getDurationMinutes() != null) {
            sessionType.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getIsActive() != null) {
            sessionType.setIsActive(request.getIsActive());
        }

        SessionType updated = sessionTypeRepository.save(sessionType);
        return SessionTypeResponse.fromSessionType(updated, true);  // Include options after update
    }

    // ADMIN: Delete session type
    @Transactional
    public void deleteSessionType(Long id) {
        SessionType sessionType = sessionTypeRepository.findById(id)
                .orElseThrow(() -> new SessionTypeNotFoundException("Session type not found with id: " + id));

        // Note: This will cascade delete all options because of orphanRemoval = true
        sessionTypeRepository.delete(sessionType);
    }
}
