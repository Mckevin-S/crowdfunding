package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for AI analysis response data.
 * Returns the results of a project's technical and financial feasibility study.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les résultats de l'analyse IA")
public class AnalyseIAResponseDTO {
    
    @Schema(description = "Identifiant de l'analyse", example = "1")
    private Long id;
    
    @Schema(description = "ID du projet analysé", example = "1")
    private Long projetId;
    
    @Schema(description = "Score de succès calculé", example = "0.85")
    private Float scoreSucces;
    
    @Schema(description = "Score de risque calculé", example = "0.15")
    private Float scoreRisque;
    
    @Schema(description = "Contenu textuel de l'analyse", example = "Le business plan est solide...")
    private String analyse;
    
    @Schema(description = "Date de génération de l'analyse", example = "2026-03-17T12:00:00")
    private LocalDateTime dateCreation;
}
