package com.example.project.controller;

import com.example.project.dto.StripePaymentIntentRequestDTO;
import com.example.project.dto.StripePaymentIntentResponseDTO;
import com.example.project.service.interfaces.StripePaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * REST Controller for coordinating Stripe payments.
 * Handles payment intent creation and receives webhook notifications from Stripe.
 */
@RestController
@RequestMapping("/api/v1/stripe")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Paiements Stripe", description = "Intégration Stripe pour les paiements par carte bancaire")
public class StripePaymentController {

    private final StripePaymentService stripePaymentService;

    /**
     * Initializes a Stripe PaymentIntent for a specific contribution.
     *
     * @param request the payment request details.
     * @return the PaymentIntent details including the client secret.
     */
    @PostMapping("/create-intent")
    @Operation(summary = "Créer une intention de paiement", description = "Génère un PaymentIntent Stripe pour permettre au frontend de sécuriser le paiement.")
    @ApiResponse(responseCode = "200", description = "Intention de paiement créée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<StripePaymentIntentResponseDTO> createPaymentIntent(
            @Valid @RequestBody StripePaymentIntentRequestDTO request) {
        return ResponseEntity.ok(stripePaymentService.createPaymentIntent(request));
    }

    /**
     * Receives and processes event notifications from Stripe (Webhooks).
     *
     * @param request the raw HTTP request containing the webhook payload.
     * @return a generic success message or error status.
     */
    @PostMapping("/webhook")
    @Operation(summary = "Webhook Stripe", description = "Endpoint de notification push utilisé par Stripe pour confirmer les paiements réussis (asynchrone).")
    @ApiResponse(responseCode = "200", description = "Événement traité")
    @ApiResponse(responseCode = "400", description = "Erreur de validation de la signature ou du payload")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) {

        String sigHeader = request.getHeader("Stripe-Signature");

        try (BufferedReader reader = request.getReader()) {
            StringBuilder payload = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                payload.append(line);
            }

            stripePaymentService.handleWebhook(payload.toString(), sigHeader);
            return ResponseEntity.ok("Webhook received successfully");

        } catch (Exception e) {
            log.error("Webhook processing error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook Error: " + e.getMessage());
        }
    }
}
