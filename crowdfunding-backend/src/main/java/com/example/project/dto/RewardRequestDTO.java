package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Data Transfer Object for creating or updating project rewards.
 * Defines the benefit a contributor receives for their support.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création ou modification d'une contrepartie")
public class RewardRequestDTO {
    
    @Schema(description = "Titre de la contrepartie", example = "Kit de démarrage")
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;
    
    @Schema(description = "Description de la contrepartie", example = "Comprend un t-shirt et un autocollant.")
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;
    
    @Schema(description = "Montant minimum requis pour obtenir cette récompense", example = "5000")
    @NotNull(message = "Le montant minimum ne doit pas être nul")
    @Positive(message = "Le montant minimum doit être positif")
    private BigDecimal montantMinimum;
    
    @Schema(description = "Nombre maximum de récompenses disponibles", example = "100")
    @NotNull(message = "La quantité ne doit pas être nulle")
    @Positive(message = "La quantité doit être positive")
    private Integer quantite;
    
    @Schema(description = "ID du projet associé", example = "1")
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
}
