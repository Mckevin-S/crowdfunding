package com.example.project.dto;

import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurResponseDTO {
    
    private Long id;
    
    private String email;
    
    private String prenom;
    
    private String nom;
    
    private String telephone;
    
    private String bio;
    
    private String address;
    
    private UserRole role;
    
    private UserStatus statut;
}
