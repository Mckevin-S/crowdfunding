package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object containing Stripe Payment Intent details.
 * Provides the client secret needed for the frontend payment form.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails de l'intention de paiement Stripe")
public class StripePaymentIntentResponseDTO {

    @Schema(description = "Secret client pour finaliser le paiement sur le frontend", example = "pi_3Mtw2L2eZvKYlo2C1GZ9...")
    private String clientSecret;
    
    @Schema(description = "Identifiant de l'objet PaymentIntent dans Stripe", example = "pi_3Mtw2L2eZvKYlo2C1GZ9")
    private String paymentIntentId;
    
    @Schema(description = "Identifiant de la contribution créée en attente", example = "1")
    private Long contributionId;
}
