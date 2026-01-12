package com.houseofvelo.api.config;


import com.houseofvelo.api.dto.ProcessPaymentRequest;
import com.squareup.square.SquareClient;
import com.squareup.square.core.ClientOptions;
import com.squareup.square.core.Environment;
import com.squareup.square.types.CreatePaymentRequest;
import com.squareup.square.types.CreatePaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SquareConfig {

    @Value("${square.access-token}")
    private String accessToken;

    @Value("${{square.environment}")
    private String environment;

    @Bean
    public SquareClient squareClient() {
        Environment env = "production".equalsIgnoreCase(environment)
                ? Environment.PRODUCTION
                : Environment.SANDBOX;

        ClientOptions options = ClientOptions.builder()
                .environment(env)
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        return new SquareClient(options);

    }
}
