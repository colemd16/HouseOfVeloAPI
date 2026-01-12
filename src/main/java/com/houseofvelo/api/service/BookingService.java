package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.BookingResponse;
import com.houseofvelo.api.dto.CancelBookingRequest;
import com.houseofvelo.api.dto.CreateBookingRequest;
import com.houseofvelo.api.exception.*;
import com.houseofvelo.api.model.*;
import com.houseofvelo.api.repository.*;
import com.houseofvelo.api.util.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SessionTypeOptionRepository sessionTypeOptionRepository;
    private final TrainerRepository trainerRepository;
    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final TrainerAvailabilityRepository trainerAvailabilityRepository;

    // Business rules constants
    private static final int MIN_HOURS_ADVANCE = 2;
    private static final int MAX_DAYS_ADVANCE = 90;
    private static final int CANCELLATION_HOURS = 24;
    private final AvailabilityService availabilityService;
    private final AvailabilityRepository availabilityRepository;

    // Create new booking
    @Transactional
    public BookingResponse createBooking(Long userId, CreateBookingRequest request){
        // Step 1: Fetch and validate all entries
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        SessionTypeOption sessionTypeOption = sessionTypeOptionRepository.findById(request.getSessionTypeOptionId())
                .orElseThrow(() -> new SessionTypeOptionNotFoundException("Session type not found with id: " + request.getSessionTypeOptionId()));

        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found with id: " + request.getTrainerId()));

        Player player = null;
        if (request.getPlayerId() != null){
            player = playerRepository.findById(request.getPlayerId())
                    .orElseThrow(() -> new PlayerNotFoundException("Player not found with id: " + request.getPlayerId()));

            // Verify player belongs to user
            if (!player.getParent().getId().equals(userId)){
                throw new UnauthorizedAccessException("Player does not belong to this user");
            }
        }

        // Step 2: Validate booking time
        validateBookingTime(request.getScheduledAt());

        // Step 3: Check Trainer availability
        validateTrainerAvailability(trainer, request.getScheduledAt(), sessionTypeOption.getSessionType().getDurationMinutes());

        // Step 4: Check for conflicts
        checkForConflicts(trainer.getId(), request.getScheduledAt(), sessionTypeOption.getSessionType().getDurationMinutes());

        // Step 5: Create Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setPlayer(player);
        booking.setSessionTypeOption(sessionTypeOption);
        booking.setTrainer(trainer);
        booking.setScheduledAt(request.getScheduledAt());
        booking.setDurationMinutes(sessionTypeOption.getSessionType().getDurationMinutes());
        booking.setStatus(BookingStatus.UNPAID);
        booking.setPricePaid(sessionTypeOption.getPrice());
        booking.setNotes(request.getNotes());

        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponse.fromBooking(savedBooking);
    }

    // Validate booking time is within acceptable window
    private void validateBookingTime(LocalDateTime scheduledAt){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime minTime = now.plusHours(MIN_HOURS_ADVANCE);
        LocalDateTime maxTime = now.plusDays(MAX_DAYS_ADVANCE);

        if (scheduledAt.isBefore(minTime)) {
            throw new InvalidBookingTimeException(
                    "Booking must be at least " + MIN_HOURS_ADVANCE + " hours in advance"
            );
        }
        if (scheduledAt.isAfter(maxTime)){
            throw new InvalidBookingTimeException(
                    "Booking cannot be made more than " + MAX_DAYS_ADVANCE + " days in advance"
            );
        }
    }
    // Validate trainer has availability for this day/time
    private void validateTrainerAvailability(Trainer trainer, LocalDateTime scheduledAt, Integer durationMinutes){
        DayOfWeek dayOfWeek = scheduledAt.getDayOfWeek();
        LocalTime startTime = scheduledAt.toLocalTime();
        LocalTime endTime = startTime.plusMinutes(durationMinutes);

        // Find availability for this day
        List<TrainerAvailability> availabilities = availabilityRepository
                .findByTrainerIdAndDayOfWeekAndIsAvailableTrue(trainer.getId(), dayOfWeek);

        if (availabilities.isEmpty()) {
            throw new InvalidBookingTimeException(
                    "Trainer is not available on " + dayOfWeek + "s"
            );
        }

        // Check if requested time falls within any availability window
        boolean isWithinAvailability = availabilities.stream()
                .anyMatch(avail ->
                        !startTime.isBefore(avail.getStartTime()) &&
                        !endTime.isAfter(avail.getEndTime()));

        if (!isWithinAvailability){
            throw new InvalidBookingTimeException(
                    "Trainer is not available at " + startTime + " on " + dayOfWeek + "s"
            );
        }
    }

    // Check for booking conflicts
    private void checkForConflicts(Long trainerId, LocalDateTime scheduledAt, Integer durationMinutes){
        LocalDateTime endTime = scheduledAt.plusMinutes(durationMinutes);

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                trainerId,
                scheduledAt,
                endTime
        );

        if (!conflicts.isEmpty()){
            throw new BookingConflictException(
                    "This time slot is already booked. Please choose a different time"
            );
        }
    }

    // Get all bookings for a user
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByScheduledAtDesc(userId)
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // Get all bookings for a user
    public List<BookingResponse> getUserUpcomingBookings(Long userId){
        LocalDateTime now = LocalDateTime.now();
        return bookingRepository.findByUserIdAndScheduledAtAfterOrderByScheduledAtAsc(userId, now)
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // Get specific booking by ID
    public BookingResponse getBookingById(Long bookingId, Long userId){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Booking not found with id: " + bookingId
                ));

        // Verify user owns the booking
        if (!booking.getUser().getId().equals(userId)){
            throw new UnauthorizedAccessException(
                    "You don't have acccess to this booking"
            );
        }
        return BookingResponse.fromBooking(booking);
    }

    // Get all bookings for a trainer
    public List<BookingResponse> getTrainerBookings(Long trainerId){
        return bookingRepository.findByTrainerIdOrderByScheduledAtDesc(trainerId)
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // Get upcoming bookings for a trainer
    public List<BookingResponse> getTrainerUpcomingBookings(Long trainerId){
        LocalDateTime now = LocalDateTime.now();
        return bookingRepository.findByTrainerIdAndScheduledAtAfterOrderByScheduledAtAsc(trainerId, now)
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // Cancel booking
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId, CancelBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        // Verify user owns this booking
        if (!booking.getUser().getId().equals(userId)){
            throw new UnauthorizedAccessException("You do not have access to this booking");
        }

        // Check if its already cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED){
            throw new IllegalStateException("Booking is already cancelled");
        }

        // Check if already completed or no-show
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.NO_SHOW) {
            throw new IllegalStateException("Cannot cancel a " + booking.getStatus().toString().toLowerCase() + " booking");
        }

        // Check the cancellation window (must cancel at least 24 hours before)
        LocalDateTime minCancellationTime = booking.getScheduledAt().minusHours(CANCELLATION_HOURS);
        if (LocalDateTime.now().isAfter(minCancellationTime)) {
            throw new InvalidBookingTimeException(
                    "Cancellation must be made at least " + CANCELLATION_HOURS + " hours before the scheduled time"
            );
        }

        // cancel booking
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(request.getReason());

        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.fromBooking(savedBooking);
    }

    // Mark booking as no-show (trainer-only)
    @Transactional
    public BookingResponse markNoShow(Long bookingId, Long trainerId){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Booking not found with id: " + bookingId
                ));

        // Verify this trainer owns the booking
        if (!booking.getTrainer().getId().equals(trainerId)){
            throw new UnauthorizedAccessException("You are not the trainer for this booking");
        }

        // Check if booking is in valid state
        if (booking.getStatus() != BookingStatus.CONFIRMED){
            throw new IllegalStateException("Only confirmed bookings can be marked as a now show");
        }

        // Check if session time has passed
        if (LocalDateTime.now().isBefore(booking.getScheduledAt())) {
            throw new InvalidBookingTimeException("Cannot mark as no-show before the session starts");
        }

        booking.setStatus(BookingStatus.NO_SHOW);
        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponse.fromBooking(savedBooking);
    }

    //ADMIN: get all bookings
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // ADMIN: Get booking by status
    public List<BookingResponse> getBookingsByStatus(BookingStatus status){
        return bookingRepository.findByStatusOrderByScheduledAtDesc(status)
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
    }

    // ADMIN: Update booking status (admin override)
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(newStatus);

        if (newStatus == BookingStatus.CANCELLED && booking.getCancelledAt() == null){
            booking.setCancelledAt(LocalDateTime.now());
        }

        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponse.fromBooking(savedBooking);
    }

    // ADMIN delete booking
    @Transactional
    public void deleteBooking(Long bookingId){
        if (!bookingRepository.existsById(bookingId)){
            throw new BookingNotFoundException("Booking not found with id: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }


    // Auto-complete old confirmed bookings (to give time to trainer or admin to submit a no show)
    // If they forget, the above method allows the admin to override it
    @Transactional
    public int autoCompleteOldBookings() {
        // Find CONFIRMED bookings where scheduled time + 24 hours has passed
        LocalDateTime cutOffTime = LocalDateTime.now().minusHours(24);
        List<Booking> oldBookings = bookingRepository
                .findByStatusAndScheduledAtBefore(BookingStatus.CONFIRMED, cutOffTime);

        oldBookings.forEach(booking -> booking.setStatus(BookingStatus.COMPLETED));
        bookingRepository.saveAll(oldBookings);

        return oldBookings.size();
    }
}
