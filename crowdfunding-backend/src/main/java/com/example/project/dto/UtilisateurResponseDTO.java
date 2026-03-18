package com.example.project.dto;

import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user response data.
 * Sent back to clients to represent a user's public or private profile.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'un utilisateur")
public class UtilisateurResponseDTO {
    
    @Schema(description = "Identifiant unique", example = "1")
    private Long id;
    
    @Schema(description = "Adresse email", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "Prénom", example = "John")
    private String prenom;
    
    @Schema(description = "Nom", example = "Doe")
    private String nom;
    
    @Schema(description = "Numéro de téléphone", example = "+2250102030405")
    private String telephone;
    
    @Schema(description = "Biographie", example = "Entrepreneur passionné...")
    private String bio;
    
    @Schema(description = "Adresse physique", example = "Cocody, Abidjan")
    private String address;
    
    @Schema(description = "Rôle de l'utilisateur", example = "PORTEUR_PROJET")
    private UserRole role;
    
    @Schema(description = "Statut du compte", example = "ACTIF")
    private UserStatus statut;
}
