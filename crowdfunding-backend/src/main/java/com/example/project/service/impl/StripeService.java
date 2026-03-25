package com.example.project.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class StripeService {

    @Value("${stripe.secret.key:sk_test_placeholder}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public Map<String, String> createPaymentIntent(BigDecimal amount, Long contributionId, String userEmail) {
        log.info("[SIMULATION] Création d'un PaymentIntent fictif pour la contribution ID: {}", contributionId);
        
        Map<String, String> response = new HashMap<>();
        // En mode simulation, on retourne des valeurs bidon qui seront traitées comme succès par le front de test
        response.put("clientSecret", "pi_simulated_secret_" + contributionId);
        response.put("id", "pi_simulated_" + contributionId);
        response.put("status", "succeeded"); 
        return response;
    }
}
