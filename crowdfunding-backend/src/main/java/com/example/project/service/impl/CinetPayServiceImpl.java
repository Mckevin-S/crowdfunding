package com.example.project.service.impl;

import com.example.project.dto.external.cinetpay.CinetPayRequest;
import com.example.project.dto.external.cinetpay.CinetPayResponse;
import com.example.project.entity.Contribution;
import com.example.project.repository.ContributionRepository;
import com.example.project.service.interfaces.CinetPayService;
import com.example.project.service.interfaces.ContributionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;

/**
 * Implementation of {@link CinetPayService}.
 * Provides integration with the CinetPay payment gateway for mobile money
 * transactions.
 * Handles payment link generation and asynchronous status notifications.
 */
@Service
@Slf4j
public class CinetPayServiceImpl implements CinetPayService {

    private final ContributionRepository contributionRepository;
    private final ContributionService contributionService;
    private final WebClient webClient;

    public CinetPayServiceImpl(
            ContributionRepository contributionRepository,
            @Lazy ContributionService contributionService,
            WebClient webClient) {
        this.contributionRepository = contributionRepository;
        this.contributionService = contributionService;
        this.webClient = webClient;
    }

    @Value("${cinetpay.api.key}")
    private String apiKey;

    @Value("${cinetpay.site.id}")
    private String siteId;

    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Override
    public String generatePaymentLink(Long contributionId, BigDecimal amount) {
        log.info("Generating real CinetPay link for contribution {} with amount {}", contributionId, amount);

        CinetPayRequest request = CinetPayRequest.builder()
                .apikey(apiKey)
                .siteId(siteId)
                .transactionId(String.valueOf(contributionId))
                .amount(amount)
                .currency("XAF")
                .description("Contribution au projet Crowdfunding")
                .notifyUrl(appUrl + "/api/v1/payments/cinetpay/notify")
                .returnUrl(appUrl + "/payment-success")
                .build();

        try {
            CinetPayResponse response = webClient.post()
                    .uri("https://api-checkout.cinetpay.com/api/v2/payment")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CinetPayResponse.class)
                    .block();

            if (response != null && "201".equals(response.getCode())) {
                return response.getData().getPayment_url();
            } else {
                log.error("CinetPay error: {}", response != null ? response.getMessage() : "No response");
            }
        } catch (Exception e) {
            log.error("Failed to call CinetPay API: {}", e.getMessage());
        }

        return "https://checkout.cinetpay.com/error"; // Fallback
    }

    @Override
    public void handleNotify(String transactionId) {
        log.info("Received CinetPay notification for transaction: {}", transactionId);

        try {
            Long contribId = Long.parseLong(transactionId);

            // Real status check
            CinetPayRequest checkRequest = CinetPayRequest.builder()
                    .apikey(apiKey)
                    .siteId(siteId)
                    .transactionId(transactionId)
                    .build();

            CinetPayResponse response = webClient.post()
                    .uri("https://api-checkout.cinetpay.com/api/v2/payment/check")
                    .bodyValue(checkRequest)
                    .retrieve()
                    .bodyToMono(CinetPayResponse.class)
                    .block();

            if (response != null && "200".equals(response.getCode())) {
                contributionService.recordSuccessfulContribution(contribId);
            } else {
                log.warn("CinetPay check failed for transaction {}: {}", transactionId,
                        response != null ? response.getMessage() : "No response");
            }
        } catch (Exception e) {
            log.error("Error processing CinetPay notification: {}", e.getMessage());
        }
    }

    @Override
    public java.util.Map<String, String> initiateSimulatedPayment(java.math.BigDecimal amount, Long contributionId,
            String phoneNumber) {
        log.info("[SIMULATION] Initiation paiement Mobile Money (CinetPay) pour le numéro: {}", phoneNumber);

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("payment_url", "https://cinetpay.com/simulated-payment/" + java.util.UUID.randomUUID());
        response.put("transaction_id", "CP-" + contributionId);
        response.put("status", "ACCEPTED");

        // Update contribution with simulated reference
        Contribution contribution = contributionRepository.findById(contributionId).orElse(null);
        if (contribution != null) {
            contribution.setMobileMoneyReference("CP-" + contributionId);
            contributionRepository.save(contribution);
        }

        return response;
    }
}
