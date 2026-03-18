package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Data Transfer Object for project reward response data.
 * Represents a benefit available for project contributors.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'une contrepartie")
public class RewardResponseDTO {
    
    @Schema(description = "Identifiant unique de la contrepartie", example = "1")
    private Long id;
    
    @Schema(description = "ID du projet parent", example = "1")
    private Long projetId;
    
    @Schema(description = "Titre", example = "Kit de démarrage")
    private String titre;
    
    @Schema(description = "Description", example = "Comprend un t-shirt...")
    private String description;
    
    @Schema(description = "Montant minimum", example = "5000")
    private BigDecimal montantMinimum;
    
    @Schema(description = "Quantité totale disponible", example = "100")
    private Integer quantite;
}
