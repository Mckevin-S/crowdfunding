package com.example.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequestDTO {
    
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;
    
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    private Float scoreAffinite;
}
