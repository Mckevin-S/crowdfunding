package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for project recommendation response data.
 * Used by the discovery engine to show relevant campaigns to users.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant une recommandation de projet")
public class RecommendationResponseDTO {
    
    @Schema(description = "Identifiant de la recommandation", example = "1")
    private Long id;
    
    @Schema(description = "ID de l'utilisateur ciblé", example = "1")
    private Long utilisateurId;
    
    @Schema(description = "ID du projet recommandé", example = "1")
    private Long projetId;
    
    @Schema(description = "Score d'affinité calculé", example = "0.92")
    private Float scoreAffinite;
}
