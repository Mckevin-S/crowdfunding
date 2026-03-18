package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for authentication responses.
 * Contains the JWT access token and basic user profile information.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Réponse d'authentification contenant le token JWT")
public class AuthResponse {

    @Schema(description = "Token d'accès JWT", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    @Schema(description = "Identifiant unique de l'utilisateur", example = "1")
    private Long id;

    @Schema(description = "Adresse email de l'utilisateur", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Rôle de l'utilisateur", example = "PORTEUR_PROJET")
    private String role;

    @Schema(description = "Nom de l'utilisateur", example = "Doe")
    private String nom;

    @Schema(description = "Prénom de l'utilisateur", example = "John")
    private String prenom;
}
