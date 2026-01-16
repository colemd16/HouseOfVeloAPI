package com.houseofvelo.api.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration // "Hey Spring, this class has important setup instructions"
@EnableWebSecurity // Activates spring security for web applications > without this, all endpoints are public, not good!
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/public").permitAll()

                        // Public GET requests - Trainers
                        .requestMatchers(HttpMethod.GET,"/api/trainers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/trainers/**").permitAll()

                        // Public GET requests - Session Types & Options
                        .requestMatchers(HttpMethod.GET, "/api/session-types/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/session-types").permitAll()

                        // Everything else needs auth
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed origins - update for production
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000", // React dev server
                "http://localhost:5173", // Vite dev server
                "https://houseofvelo.nurill.com" // This will be houseofvelo.com, for now we will put it on the nurill domain
        ));

        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of(
                "GET","POST","PUT","DELETE","OPTIONS"
        ));

        // Allowed Headers
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-type",
                "X-Requested-With"
        ));

        // Expose headers (if frontend needs to read any response headers)
        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // How long browser can cache preflight response (1 hour)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
