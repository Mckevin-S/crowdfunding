package com.example.project.service.impl;

import com.example.project.dto.external.cinetpay.CinetPayRequest;
import com.example.project.dto.external.cinetpay.CinetPayResponse;
import com.example.project.repository.ContributionRepository;
import com.example.project.service.interfaces.CinetPayService;
import com.example.project.service.interfaces.ContributionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;

/**
 * Implementation of {@link CinetPayService}.
 * Provides integration with the CinetPay payment gateway for mobile money transactions.
 * Handles payment link generation and asynchronous status notifications.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CinetPayServiceImpl implements CinetPayService {

    private final ContributionRepository contributionRepository;
    private final ContributionService contributionService;
    private final WebClient webClient;

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
}
