package com.houseofvelo.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "square")
@Data
public class SquareProperties {
    private String accessToken;
    private String applicationId;
    private String locationId;
    private String environment;
}
