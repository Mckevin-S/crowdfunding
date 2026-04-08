package com.example.project.dto;

import com.example.project.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Google Authentication request.
 * Contains the Google ID token and an optional role for new registrations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {
    
    @NotBlank(message = "Identity token is required")
    private String idToken;
    
    /**
     * Optional role to assign if a new user is created.
     * Defaults to CONTRIBUTEUR in the service if not provided.
     */
    private UserRole role;
}
