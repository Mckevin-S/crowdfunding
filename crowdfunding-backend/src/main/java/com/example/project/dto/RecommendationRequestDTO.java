package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating or updating a project recommendation.
 * Links a user to a project with a calculated affinity score.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création d'une recommandation de projet")
public class RecommendationRequestDTO {
    
    @Schema(description = "ID de l'utilisateur ciblé", example = "1")
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;
    
    @Schema(description = "ID du projet recommandé", example = "1")
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    @Schema(description = "Score d'affinité calculé (0.0 à 1.0)", example = "0.92")
    private Float scoreAffinite;
}
