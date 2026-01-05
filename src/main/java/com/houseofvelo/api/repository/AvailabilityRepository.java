package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Trainer;
import com.houseofvelo.api.model.TrainerAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<TrainerAvailability, Long> {

    // Find all availability slots for a trainer
    List<TrainerAvailability> findByTrainerId(Long trainerId);

    // Find availability for specific trainer and day
    List<TrainerAvailability> findByTrainerIdAndDayOfWeek(Long trainerId, DayOfWeek dayOfWeek);

    // Find only active (available) slots
    List<TrainerAvailability> findByTrainerIdAndIsAvailableTrue(Long trainerId);
}
