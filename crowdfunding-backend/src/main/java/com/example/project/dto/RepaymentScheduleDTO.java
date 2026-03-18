package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for a loan repayment installment.
 * Represents a single monthly payment in a loan's schedule.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Détails d'une échéance de remboursement de prêt")
public class RepaymentScheduleDTO {
    
    @Schema(description = "Identifiant de l'échéance", example = "1")
    private Long id;
    
    @Schema(description = "ID du projet associé", example = "1")
    private Long projetId;
    
    @Schema(description = "Numéro d'ordre de l'échéance", example = "1")
    private Integer numeroEcheance;
    
    @Schema(description = "Date prévue pour le paiement", example = "2026-04-17")
    private LocalDate dateEcheance;
    
    @Schema(description = "Montant total à payer (Principal + Intérêts)", example = "1050")
    private BigDecimal montantTotal;
    
    @Schema(description = "Part du capital remboursée", example = "1000")
    private BigDecimal montantCapital;
    
    @Schema(description = "Part des intérêts payée", example = "50")
    private BigDecimal montantInterets;
    
    @Schema(description = "Capital restant dû après ce paiement", example = "9000")
    private BigDecimal capitalRestant;
    
    @Schema(description = "Statut du paiement (EN_ATTENTE, PAYE)", example = "EN_ATTENTE")
    private String statut;
}
