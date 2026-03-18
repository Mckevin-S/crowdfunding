package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Data Transfer Object for requesting a Stripe Payment Intent.
 * Used to initiate a secure payment session for a contribution.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création d'une intention de paiement Stripe")
public class StripePaymentIntentRequestDTO {

    @Schema(description = "ID du projet à soutenir", example = "1")
    @NotNull(message = "L'ID du projet est requis")
    private Long projetId;

    @Schema(description = "ID de l'utilisateur qui effectue le paiement", example = "1")
    @NotNull(message = "L'ID de l'utilisateur est requis")
    private Long utilisateurId;

    @Schema(description = "Montant de la contribution", example = "5000")
    @NotNull(message = "Le montant est requis")
    @Positive(message = "Le montant doit être strictement positif")
    private BigDecimal amount;
    
    @Schema(description = "ID optionnel de la contrepartie choisie", example = "1")
    private Long rewardId;
}
