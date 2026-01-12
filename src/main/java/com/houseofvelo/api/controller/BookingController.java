package com.houseofvelo.api.controller;

import com.houseofvelo.api.dto.BookingResponse;
import com.houseofvelo.api.dto.CancelBookingRequest;
import com.houseofvelo.api.dto.CreateBookingRequest;
import com.houseofvelo.api.model.BookingStatus;
import com.houseofvelo.api.service.BookingService;
import com.houseofvelo.api.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final TrainerService trainerService;

    // ======================= USER ENDPOINTS =======================

    /**
     * Create a new booking
     */
    @PostMapping("/api/bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request
    ) {
        Long userId = (Long) authentication.getCredentials();
        BookingResponse booking = bookingService.createBooking(userId, request);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    /**
     * Get all my bookings
     */
    @GetMapping("/api/bookings/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        List<BookingResponse> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get my upcoming bookings only
     */
    @GetMapping("/api/bookings/me/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponse>> getMyUpcomingBookings(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        List<BookingResponse> bookings = bookingService.getUserUpcomingBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get specific booking by ID
     */
    @GetMapping("/api/bookings/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getCredentials();
        BookingResponse booking = bookingService.getBookingById(id, userId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Cancel a booking
     */
    @PutMapping("/api/bookings/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody(required = false) CancelBookingRequest request
    ) {
        Long userId = (Long) authentication.getCredentials();

        // If no request body, create empty one
        if (request == null) {
            request = new CancelBookingRequest();
        }

        BookingResponse booking = bookingService.cancelBooking(id, userId, request);
        return ResponseEntity.ok(booking);
    }

    // ======================= TRAINER ENDPOINTS =======================

    /**
     * Get all bookings for logged-in trainer
     */
    @GetMapping("/api/trainers/me/bookings")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<BookingResponse>> getMyTrainerBookings(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        Long trainerId = trainerService.getTrainerIdByUserId(userId);
        List<BookingResponse> bookings = bookingService.getTrainerBookings(trainerId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get upcoming bookings for logged-in trainer
     */
    @GetMapping("/api/trainers/me/bookings/upcoming")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<BookingResponse>> getMyTrainerUpcomingBookings(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        Long trainerId = trainerService.getTrainerIdByUserId(userId);
        List<BookingResponse> bookings = bookingService.getTrainerUpcomingBookings(trainerId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Mark booking as no-show
     */
    @PutMapping("/api/bookings/{id}/no-show")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<BookingResponse> markNoShow(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getCredentials();
        Long trainerId = trainerService.getTrainerIdByUserId(userId);
        BookingResponse booking = bookingService.markNoShow(id, trainerId);
        return ResponseEntity.ok(booking);
    }

    // ======================= ADMIN ENDPOINTS =======================

    /**
     * Get all bookings (admin)
     */
    @GetMapping("/api/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) String status
    ) {
        if (status != null) {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            List<BookingResponse> bookings = bookingService.getBookingsByStatus(bookingStatus);
            return ResponseEntity.ok(bookings);
        }

        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    /**
     * Update booking status (admin override)
     */
    @PutMapping("/api/admin/bookings/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
        BookingResponse booking = bookingService.updateBookingStatus(id, newStatus);
        return ResponseEntity.ok(booking);
    }

    /**
     * Delete booking (admin)
     */
    @DeleteMapping("/api/admin/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Trigger auto-complete job manually (admin only - for testing)
     */
    @PostMapping("/api/admin/bookings/auto-complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> triggerAutoComplete() {
        int completed = bookingService.autoCompleteOldBookings();
        return ResponseEntity.ok(completed + " bookings auto-completed");
    }
}
