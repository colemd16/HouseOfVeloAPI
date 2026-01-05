package com.houseofvelo.api.repository;

import com.houseofvelo.api.model.PricingType;
import com.houseofvelo.api.model.SessionType;
import com.houseofvelo.api.model.SessionTypeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionTypeOptionRepository extends JpaRepository<SessionTypeOption, Long> {

    //Find all options for a specific session type
    List<SessionTypeOption> findBySessionTypeId(Long sessionTypeId);

    // Find active options for a specific session type
    List<SessionTypeOption> findBySessionTypeIdAndIsActiveTrue(Long sessionTypeId);

    // Find options by pricing type
    List<SessionTypeOption> findByPricingType(PricingType pricingType);

    // Find subscription options only
    List<SessionTypeOption> findByPricingTypeAndIsActiveTrue(PricingType pricingType);
}
