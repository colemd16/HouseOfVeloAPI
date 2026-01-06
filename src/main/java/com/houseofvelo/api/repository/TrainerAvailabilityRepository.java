package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.Trainer;
import com.houseofvelo.api.model.TrainerAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface TrainerAvailabilityRepository extends JpaRepository<TrainerAvailability, Long> {

    // Find all availability for a trainer
    List<TrainerAvailability> findByTrainerId(Long trainerId);

    // Find availability for a specific day
    List<TrainerAvailability> findByTrainerIdAndDayOfWeek(Long trainerId, DayOfWeek dayOfWeek);

    // Find available slots only
    List<TrainerAvailability> findByTrainerIdAndIsAvailableTrue(Long trainerId);

    // Find available slots for a specific day
    List<TrainerAvailability> findByTrainerIdAndDayOfWeekAndIsAvailableTrue(Long trainerId, DayOfWeek dayOfWeek);

    // Delete all availability for a trainer (when updating a schedule)
    void deleteByTrainerId(Long trainerId);

}
