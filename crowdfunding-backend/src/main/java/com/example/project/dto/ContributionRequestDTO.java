package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Data Transfer Object for creating a new project contribution.
 * Specifies the financial support provided by a user to a project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création d'une contribution")
public class ContributionRequestDTO {
    
    @Schema(description = "Montant de la contribution", example = "10000")
    @NotNull(message = "Le montant ne doit pas être nul")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal amount;
    
    @Schema(description = "ID du projet soutenu", example = "1")
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    @Schema(description = "ID de l'utilisateur contributeur", example = "1")
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;

    @Schema(description = "Devise de la contribution", example = "XAF")
    private String currency = "XAF";
}
