package com.houseofvelo.api.service;

import com.houseofvelo.api.dto.CreateSessionTypeOptionRequest;
import com.houseofvelo.api.dto.SessionTypeOptionResponse;
import com.houseofvelo.api.dto.UpdateSessionTypeOptionRequest;
import com.houseofvelo.api.exception.SessionTypeOptionNotFoundException;
import com.houseofvelo.api.model.PricingType;
import com.houseofvelo.api.model.SessionType;
import com.houseofvelo.api.model.SessionTypeOption;
import com.houseofvelo.api.repository.SessionTypeOptionRepository;
import com.houseofvelo.api.repository.SessionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionTypeOptionService {

    private final SessionTypeOptionRepository optionRepository;
    private final SessionTypeRepository sessionTypeRepository;

    // PUBLIC: Get active options for a session type
    public List<SessionTypeOptionResponse> getActiveOptions(Long sessionTypeId){
        return optionRepository.findBySessionTypeIdAndIsActiveTrue(sessionTypeId)
                .stream()
                .map(SessionTypeOptionResponse::fromOption)
                .collect(Collectors.toList());
    }

    // PUBLIC: get a specific option
    public SessionTypeOptionResponse getOptionById(Long id){
        SessionTypeOption option = optionRepository.findById(id)
                .orElseThrow(() -> new SessionTypeOptionNotFoundException("Option not found for this session type"));

        return SessionTypeOptionResponse.fromOption(option);
    }

    // ADMIN: Get all options for a session type (including inactive)
    public List<SessionTypeOptionResponse> getAllOptions(Long sessionTypeId){
        return optionRepository.findBySessionTypeId(sessionTypeId)
                .stream()
                .map(SessionTypeOptionResponse::fromOption)
                .collect(Collectors.toList());
    }

    // ADMIN: Create option
    public SessionTypeOptionResponse createOption(Long sessionTypeId, CreateSessionTypeOptionRequest request){
        SessionType sessionType = sessionTypeRepository.findById(sessionTypeId)
                .orElseThrow(() -> new SessionTypeOptionNotFoundException("Session type not found with id: " + sessionTypeId));

        // Validate Subscription Fields
        if (request.getPricingType() == PricingType.SUBSCRIPTION) {
            if (request.getBillingPeriodDays() == null || request.getBillingPeriodDays() <= 0){
                throw new IllegalArgumentException("Billing period days are required for subscriptions");
            }
        }

        SessionTypeOption option = new SessionTypeOption();
        option.setSessionType(sessionType);
        option.setName(request.getName());
        option.setDescription(request.getDescription());
        option.setPrice(request.getPrice());
        option.setPricingType(request.getPricingType());
        option.setBillingPeriodDays(request.getBillingPeriodDays());
        option.setSessionsPerWeek(request.getSessionsPerWeek());
        option.setAutoRenew(request.getAutoRenew());
        option.setMaxParticipants(request.getMaxParticipants());
        option.setIsActive(true);

        SessionTypeOption saved = optionRepository.save(option);
        return SessionTypeOptionResponse.fromOption(saved);

    }

    // ADMIN: update option
    @Transactional
    public SessionTypeOptionResponse updateOption(Long id, UpdateSessionTypeOptionRequest request){
        SessionTypeOption option = optionRepository.findById(id)
                .orElseThrow(() -> new SessionTypeOptionNotFoundException("Option not found for this session type"));

        //Update only non-null fields
        if (request.getName() != null) {
            option.setName(request.getName());
        }
        if (request.getDescription() != null){
            option.setDescription(request.getDescription());
        }
        if (request.getPrice() != null){
            option.setPrice(request.getPrice());
        }
        if (request.getPricingType() != null){
            option.setPricingType(request.getPricingType());
        }
        if (request.getBillingPeriodDays() != null){
            option.setBillingPeriodDays(request.getBillingPeriodDays());
        }
        if (request.getSessionsPerWeek() != null){
            option.setSessionsPerWeek(request.getSessionsPerWeek());
        }
        if (request.getAutoRenew() != null){
            option.setAutoRenew(request.getAutoRenew());
        }
        if (request.getMaxParticipants() != null){
            option.setMaxParticipants(request.getMaxParticipants());
        }
        if (request.getIsActive() != null){
            option.setIsActive(request.getIsActive());
        }

        SessionTypeOption updated = optionRepository.save(option);
        return SessionTypeOptionResponse.fromOption(updated);
    }

    // ADMIN: Delete option
    @Transactional
    public void deleteOption(Long id){
        SessionTypeOption option = optionRepository.findById(id)
                .orElseThrow(() -> new SessionTypeOptionNotFoundException("Option not found for this session type"));

        optionRepository.delete(option);
    }
}
