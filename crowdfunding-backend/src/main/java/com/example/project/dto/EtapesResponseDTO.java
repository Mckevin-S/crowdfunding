package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for project milestone response data.
 * Represents a specific phase and its current development status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'une étape")
public class EtapesResponseDTO {
    
    @Schema(description = "Identifiant unique de l'étape", example = "1")
    private Long id;
    
    @Schema(description = "ID du projet parent", example = "1")
    private Long projetId;
    
    @Schema(description = "Titre de l'étape", example = "Achat du matériel")
    private String titre;
    
    @Schema(description = "Description de l'étape", example = "Acquisition des panneaux solaires...")
    private String description;
    
    @Schema(description = "Progression actuelle (%)", example = "100")
    private Integer progress;
    
    @Schema(description = "Statut de complétion", example = "true")
    private Boolean estTermine;
}
