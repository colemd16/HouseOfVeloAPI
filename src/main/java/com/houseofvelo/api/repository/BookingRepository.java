package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Booking;
import com.houseofvelo.api.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings by user
    List<Booking> findByUserIdOrderByScheduledAtDesc(Long userId);

    // Find upcoming bookings for a user
    List<Booking> findByUserIdAndScheduledAtAfterOrderByScheduledAtAsc(Long userId, LocalDateTime after);

    // Find all bookings for a trainer
    List<Booking> findByTrainerIdOrderByScheduledAtDesc(Long trainerId);

    // Find all upcoming bookings for a trainer
    List<Booking> findByTrainerIdAndScheduledAtAfterOrderByScheduledAtAsc(Long trainerId, LocalDateTime after);

    // Find bookings by status
    List<Booking> findByStatusOrderByScheduledAtDesc(BookingStatus status);

    @Query(value = "SELECT * FROM bookings b " +
            "WHERE b.trainer_id = :trainerId " +
            "AND b.status IN ('CONFIRMED', 'UNPAID') " +
            "AND b.scheduled_at < :endTime " +
            "AND (b.scheduled_at + (b.duration_minutes || ' minutes')::INTERVAL) > :startTime",
            nativeQuery = true)
    List<Booking> findConflictingBookings(
            @Param("trainerId") Long trainerId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    // Find old confirmed bookings for auto-completion
    List<Booking> findByStatusAndScheduledAtBefore(BookingStatus status, LocalDateTime before);
}
