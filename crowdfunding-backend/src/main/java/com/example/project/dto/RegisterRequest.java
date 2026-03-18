package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user registration requests.
 * Contains necessary information to create a new user account.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Demande d'inscription d'un nouvel utilisateur")
public class RegisterRequest {

    @Schema(description = "Adresse email de l'utilisateur", example = "john.doe@example.com")
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;

    @Schema(description = "Mot de passe de l'utilisateur (min 8 caractères)", example = "Password123!")
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;

    @Schema(description = "Prénom de l'utilisateur", example = "John")
    @NotBlank(message = "Le prénom est requis")
    private String prenom;

    @Schema(description = "Nom de l'utilisateur", example = "Doe")
    @NotBlank(message = "Le nom est requis")
    private String nom;

    @Schema(description = "Rôle de l'utilisateur", example = "PORTEUR_PROJET", allowableValues = {"PORTEUR_PROJET", "CONTRIBUTEUR"})
    @NotBlank(message = "Le rôle est requis")
    private String role;
}
