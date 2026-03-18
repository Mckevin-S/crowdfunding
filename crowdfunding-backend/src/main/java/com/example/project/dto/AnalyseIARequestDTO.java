package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for sending an AI analysis request or update.
 * Contains success/risk scores and detailed qualitative analysis text.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande ou mise à jour d'une analyse IA pour un projet")
public class AnalyseIARequestDTO {
    
    @Schema(description = "ID du projet à analyser", example = "1")
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    @Schema(description = "Note de probabilité de succès (0.0 à 1.0)", example = "0.85")
    private Float scoreSucces;
    
    @Schema(description = "Note de niveau de risque (0.0 à 1.0)", example = "0.15")
    private Float scoreRisque;
    
    @Schema(description = "Texte détaillé de l'analyse générée par l'IA", example = "Ce projet présente un fort potentiel grâce à...")
    private String analyse;
}
