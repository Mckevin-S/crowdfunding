package com.example.project.dto;

import com.example.project.enums.StatutProjet;
import com.example.project.enums.TypeFinancement;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for project response data.
 * Includes current funding progress and project status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'un projet")
public class ProjetResponseDTO {
    
    @Schema(description = "Identifiant unique du projet", example = "1")
    private Long id;
    
    @Schema(description = "Titre du projet", example = "Solaire pour tous")
    private String titre;
    
    @Schema(description = "Description du projet", example = "Installation de panneaux solaires...")
    private String description;
    
    @Schema(description = "Objectif total à financer", example = "1000000")
    private BigDecimal objectifFinancier;
    
    @Schema(description = "Montant actuellement récolté", example = "250000")
    private BigDecimal montantActuel;
    
    @Schema(description = "Type de financement", example = "DON")
    private TypeFinancement typeFinancement;
    
    @Schema(description = "Statut actuel", example = "EN_COURS")
    private StatutProjet statut;
    
    @Schema(description = "Date de début", example = "2026-04-01")
    private LocalDate dateDebut;
    
    @Schema(description = "Date de fin", example = "2026-06-30")
    private LocalDate dateFin;
    
    @Schema(description = "ID du porteur du projet", example = "1")
    private Long porteurId;
}
