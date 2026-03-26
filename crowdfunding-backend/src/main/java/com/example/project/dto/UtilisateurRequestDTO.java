package com.example.project.dto;

import com.example.project.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user creation or update requests.
 * Contains profile details and account settings.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création ou modification d'un utilisateur")
public class UtilisateurRequestDTO {
    
    @Schema(description = "Adresse email", example = "john.doe@example.com")
    @NotBlank(message = "L'email ne doit pas être vide")
    @Email(message = "L'email doit être valide")
    private String email;
    
    @Schema(description = "Mot de passe", example = "Password123!")
    // Sur mise à jour, mot de passe optionnel (ne pas forcer si non changé)
    private String motsDePasse;
    
    @Schema(description = "Prénom", example = "John")
    @NotBlank(message = "Le prénom ne doit pas être vide")
    private String prenom;
    
    @Schema(description = "Nom", example = "Doe")
    @NotBlank(message = "Le nom ne doit pas être vide")
    private String nom;
    
    @Schema(description = "Numéro de téléphone", example = "+2250102030405")
    private String telephone;
    
    @Schema(description = "Biographie de l'utilisateur", example = "Entrepreneur passionné par les technologies durables.")
    private String bio;
    
    @Schema(description = "Adresse physique", example = "Cocody, Abidjan")
    private String address;
    
    @Schema(description = "Ville", example = "Abidjan")
    private String ville;
    
    @Schema(description = "Catégorie préférée", example = "Technologie")
    private String categoriePreferee;
    
    @Schema(description = "Rôle assigné", example = "CONTRIBUTEUR")
    private UserRole role;
}
