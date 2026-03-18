package com.example.project.dto;

import com.example.project.enums.StatutProjet;
import com.example.project.enums.TypeFinancement;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for project creation or update requests.
 * Defines the budget, timeline, and type of crowdfunding.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création ou modification d'un projet")
public class ProjetRequestDTO {
    
    @Schema(description = "Titre du projet", example = "Solaire pour tous")
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;
    
    @Schema(description = "Description détaillée du projet", example = "Installation de panneaux solaires dans les zones rurales.")
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;
    
    @Schema(description = "Objectif financier à atteindre", example = "1000000")
    @NotNull(message = "L'objectif financier ne doit pas être nul")
    private BigDecimal objectifFinancier;
    
    @Schema(description = "Type de financement", example = "DON", allowableValues = {"DON", "PRET", "EQUITY"})
    @NotNull(message = "Le type de financement ne doit pas être nul")
    private TypeFinancement typeFinancement;
    
    @Schema(description = "Date de début de la campagne", example = "2026-04-01")
    @NotNull(message = "La date de début ne doit pas être nulle")
    private LocalDate dateDebut;
    
    @Schema(description = "Date de fin de la campagne", example = "2026-06-30")
    @NotNull(message = "La date de fin ne doit pas être nulle")
    private LocalDate dateFin;
    
    @Schema(description = "Statut initial du projet", example = "BROUILLON")
    private StatutProjet statut;
    
    @Schema(description = "ID de l'utilisateur porteur du projet", example = "1")
    private Long porteurId;
}
