package com.example.project.dto;

import com.example.project.enums.ContribStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for contribution response data.
 * Confirms the details and status of a financial support transaction.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'une contribution")
public class ContributionResponseDTO {
    
    @Schema(description = "Identifiant de la contribution", example = "1")
    private Long id;
    
    @Schema(description = "ID du projet soutenu", example = "1")
    private Long projetId;
    
    @Schema(description = "ID de l'utilisateur contributeur", example = "1")
    private Long utilisateurId;
    
    @Schema(description = "Montant versé", example = "10000")
    private BigDecimal amount;
    
    @Schema(description = "Statut du paiement", example = "COMPLETE")
    private ContribStatus status;
    
    @Schema(description = "Date et heure de la contribution", example = "2026-03-17T12:00:00")
    private LocalDateTime dateContribution;

    @Schema(description = "Métadonnées de paiement (pour Stripe/CinetPay)")
    private java.util.Map<String, String> paymentMetadata;
}
