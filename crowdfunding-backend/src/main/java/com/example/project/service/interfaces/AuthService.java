package com.example.project.service.interfaces;

import com.example.project.dto.AuthResponse;
import com.example.project.dto.LoginRequest;
import com.example.project.dto.RegisterRequest;

/**
 * Service interface for user authentication and registration.
 * Manages JWT generation and credential verification.
 */
public interface AuthService {
    /**
     * Registers a new user in the system.
     *
     * @param request the registration details.
     * @return the authentication response including JWT.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user based on credentials.
     *
     * @param request the login request.
     * @return the authentication response including JWT.
     */
    AuthResponse login(LoginRequest request);
}
