package com.example.project.service.interfaces;

import com.example.project.dto.StripePaymentIntentRequestDTO;
import com.example.project.dto.StripePaymentIntentResponseDTO;

/**
 * Service interface for processing payments via Stripe.
 * Manages Payment Intent creation and webhook processing for asynchronous payment events.
 */
public interface StripePaymentService {
    /**
     * Creates a new Payment Intent for a project contribution.
     *
     * @param dto the payment intent request details.
     * @return the payment intent response containing the client secret.
     */
    StripePaymentIntentResponseDTO createPaymentIntent(StripePaymentIntentRequestDTO dto);

    /**
     * Handles incoming Stripe webhooks for payment state updates.
     *
     * @param payload the raw request body payload.
     * @param sigHeader the Stripe-Signature header.
     */
    void handleWebhook(String payload, String sigHeader);
}
