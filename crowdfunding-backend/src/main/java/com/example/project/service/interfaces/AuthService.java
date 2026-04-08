package com.example.project.service.interfaces;

import com.example.project.dto.*;

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

    /**
     * Initiates the password reset flow.
     * Generates a token and sends an email to the user.
     *
     * @param request contains the user email.
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Resets the user password using a valid token.
     *
     * @param request contains the token and new password.
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Verifies if the reset code is valid for a given email.
     *
     * @param request contains email and code.
     */
    void verifyResetCode(VerifyCodeRequest request);

    /**
     * Changes the password for an authenticated user.
     *
     * @param request contains old and new passwords.
     */
    void changePassword(ChangePasswordRequest request);

    /**
     * Generates an authentication response (JWT) for a given user.
     *
     * @param user the user entity.
     * @return the authentication response.
     */
    AuthResponse generateAuthResponse(com.example.project.entity.Utilisateur user);

    /**
     * Gets the currently authenticated user.
     *
     * @return the authentication response with current user data.
     */
    AuthResponse getCurrentUser();
}
