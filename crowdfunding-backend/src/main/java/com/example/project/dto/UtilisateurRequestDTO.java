package com.example.project.dto;

import com.example.project.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurRequestDTO {
    
    @NotBlank(message = "L'email ne doit pas être vide")
    @Email(message = "L'email doit être valide")
    private String email;
    
    @NotBlank(message = "Le mot de passe ne doit pas être vide")
    private String motsDePasse;
    
    @NotBlank(message = "Le prénom ne doit pas être vide")
    private String prenom;
    
    @NotBlank(message = "Le nom ne doit pas être vide")
    private String nom;
    
    private String telephone;
    
    private String bio;
    
    private String address;
    
    private UserRole role;
}
