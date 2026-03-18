package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for login requests.
 * Contains user credentials for authentication.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Demande d'authentification utilisateur")
public class LoginRequest {

    @Schema(description = "Adresse email de l'utilisateur", example = "john.doe@example.com")
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;

    @Schema(description = "Mot de passe de l'utilisateur", example = "Password123!")
    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}
