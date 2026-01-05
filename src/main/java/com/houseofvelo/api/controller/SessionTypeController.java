package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.*;
import com.houseofvelo.api.model.SessionType;
import com.houseofvelo.api.service.SessionTypeOptionService;
import com.houseofvelo.api.service.SessionTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.hibernate.Session;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResponseExtractor;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SessionTypeController {

    private final SessionTypeService sessionTypeService;
    private final SessionTypeOptionService optionService;

    // ======================= SESSION TYPES =======================

    // PUBLIC: Get all active session types
    @GetMapping("/api/session-types")
    public ResponseEntity<List<SessionTypeResponse>> getAllActiveSessionTypes() {
        List<SessionTypeResponse> sessionTypes = sessionTypeService.getAllActiveSessionTypes();
        return ResponseEntity.ok(sessionTypes);
    }

    // PUBLIC: Get specific session type (includes options)
    @GetMapping("/api/session-types/{id}")
    public ResponseEntity<SessionTypeResponse> getSessionTypeById(@PathVariable Long id){
        SessionTypeResponse sessionType = sessionTypeService.getSessionTypeById(id);
        return ResponseEntity.ok(sessionType);
    }

    // ADMIN: Get all session types (including inactive)
    @GetMapping("/api/admin/session-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SessionTypeResponse>> getAllSessionTypes(){
        List<SessionTypeResponse> sessionTypes = sessionTypeService.getAllSessionTypes();
        return ResponseEntity.ok(sessionTypes);
    }

    // ADMIN: Create session type
    @PostMapping("/api/admin/session-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SessionTypeResponse> createSessionType(@Valid @RequestBody CreateSessionTypeRequest request){
        SessionTypeResponse sessionType = sessionTypeService.createSessionType(request);
        return new ResponseEntity<>(sessionType, HttpStatus.CREATED);
    }

    // ADMIN: update session type
    @PutMapping("/api/admin/session-types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SessionTypeResponse> updateSessionType(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSessionTypeRequest request
    ) {
        SessionTypeResponse sessionType = sessionTypeService.updateSessionType(id, request);
        return ResponseEntity.ok(sessionType);
    }

    // ADMIN: Delete session type
    @DeleteMapping("/api/admin/session-types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSessionType(@PathVariable Long id){
        sessionTypeService.deleteSessionType(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== SESSION TYPE OPTIONS ====================

    // PUBLIC: get active options for a session type
    @GetMapping("/api/session-types/{sessionTypeId}/options")
    public ResponseEntity<List<SessionTypeOptionResponse>> getActiveOptions(@PathVariable Long sessionTypeId){
        List<SessionTypeOptionResponse> options = optionService.getActiveOptions(sessionTypeId);
        return ResponseEntity.ok(options);
    }

    // PUBLIC: get specific option
    @GetMapping("/api/session-types/{sessionTypeId}/options/{id}")
    public ResponseEntity<SessionTypeOptionResponse> getOptionById(
            @PathVariable Long sessionTypeId,
            @PathVariable Long id
    ){
        SessionTypeOptionResponse option = optionService.getOptionById(id);
        return ResponseEntity.ok(option);
    }

    // ADMIN: Get all options for a session type (including inactive)
    // ADMIN: Get all options for a session type (including inactive)
    @GetMapping("/api/admin/session-types/{sessionTypeId}/options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SessionTypeOptionResponse>> getAllOptions(@PathVariable Long sessionTypeId){
        List<SessionTypeOptionResponse> options = optionService.getAllOptions(sessionTypeId);
        return ResponseEntity.ok(options);
    }

    // ADMIN: Create option
    @PostMapping("/api/admin/session-types/{sessionTypeId}/options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SessionTypeOptionResponse> createOption(
            @PathVariable Long sessionTypeId,
            @Valid @RequestBody CreateSessionTypeOptionRequest request
    ){
        SessionTypeOptionResponse option = optionService.createOption(sessionTypeId, request);
        return new ResponseEntity<>(option, HttpStatus.CREATED);
    }

    // ADMIN: Update option
    @PutMapping("/api/admin/session-types/{sessionTypeId}/options/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SessionTypeOptionResponse> updateOption(
            @PathVariable Long sessionTypeId,
            @PathVariable Long id,
            @Valid @RequestBody UpdateSessionTypeOptionRequest request
    ){
        SessionTypeOptionResponse option = optionService.updateOption(id, request);
        return ResponseEntity.ok(option);
    }

    // ADMIN: Delete Option
    @DeleteMapping("/api/admin/session-types/{sessionTypeId}/options/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOption(
            @PathVariable Long sessionTypeId,
            @PathVariable Long id
    ){
        optionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }






}
