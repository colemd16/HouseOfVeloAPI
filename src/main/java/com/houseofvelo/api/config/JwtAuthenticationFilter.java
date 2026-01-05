package com.houseofvelo.api.config;

import com.houseofvelo.api.model.Role;
import com.houseofvelo.api.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Step 1: Extract JWT Token from Authorization header
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            //No token found, continue to the next filter
            filterChain.doFilter(request, response);
            return;
        }

        // Step 2: Extract token (remove "Bearer " prefix)
        final String jwt = authHeader.substring(7);

        try {
            // Step 3: Extract email from token
            final String userEmail = jwtUtil.extractEmail(jwt);

            // Step 4: Check is user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){

                // Step 5: Validate token
                if (jwtUtil.validateToken(jwt, userEmail)){

                    // Step 6: Extract role from token
                    Role role = jwtUtil.extractRole(jwt);
                    Long userId = jwtUtil.extractUserId(jwt);

                    // Step 7: Create authentication object
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail,
                            userId,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
                    );

                    // Step 8: Set additional details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Step 9: Set authentication in Spring Security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e){
            // Token is invalid - log and continue without auth
            logger.error("JWT validation error: " + e.getMessage());
        }

        // Step 10: Continue to next filter in chain
        filterChain.doFilter(request, response);
    }

}
