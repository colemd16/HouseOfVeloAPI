package com.houseofvelo.api.dto;

import com.houseofvelo.api.model.SessionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private Boolean isActive;
    private List<SessionTypeOptionResponse> options;  // Can be null
    private String createdAt;
    private String updatedAt;

    // Method 1: Default - includes options
    public static SessionTypeResponse fromSessionType(SessionType sessionType) {
        return fromSessionType(sessionType, true);  // Default to including options
    }

    // Method 2: With control over options
    public static SessionTypeResponse fromSessionType(SessionType sessionType, boolean includeOptions) {
        SessionTypeResponse response = new SessionTypeResponse();
        response.setId(sessionType.getId());
        response.setName(sessionType.getName());
        response.setDescription(sessionType.getDescription());
        response.setDurationMinutes(sessionType.getDurationMinutes());
        response.setIsActive(sessionType.getIsActive());

        // Only include options if requested AND they exist
        if (includeOptions && sessionType.getOptions() != null && !sessionType.getOptions().isEmpty()) {
            response.setOptions(
                    sessionType.getOptions()
                            .stream()
                            .map(SessionTypeOptionResponse::fromOption)
                            .collect(Collectors.toList())
            );
        }

        response.setCreatedAt(sessionType.getCreatedAt().toString());
        response.setUpdatedAt(sessionType.getUpdatedAt().toString());
        return response;
    }
}
