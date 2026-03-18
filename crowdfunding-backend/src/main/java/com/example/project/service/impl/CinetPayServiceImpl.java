package com.example.project.service.impl;

import com.example.project.entity.Contribution;
import com.example.project.enums.ContribStatus;
import com.example.project.repository.ContributionRepository;
import com.example.project.service.interfaces.CinetPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    @Value("${cinetpay.api.key}")
    private String apiKey;

    @Value("${cinetpay.site.id}")
    private String siteId;

    @Override
    public String generatePaymentLink(Long contributionId, BigDecimal amount) {
        log.info("Generating CinetPay link for contribution {} with amount {}", contributionId, amount);
        // FIXME: Call CinetPay REST API to generate a link. Returning dummy link for
        // now.
        return "https://checkout.cinetpay.com/payment/" + contributionId + "-dummy-token";
    }

    @Override
    public void handleNotify(String transactionId) {
        log.info("Received CinetPay notification for transaction: {}", transactionId);

        // FIXME: Extract contributionId from transaction detail
        // For demonstration, assume transactionId IS the contributionId string
        try {
            Long contribId = Long.parseLong(transactionId);
            Contribution contribution = contributionRepository.findById(contribId).orElse(null);

            if (contribution != null && contribution.getStatus() == ContribStatus.PENDING) {
                // Call CinetPay check payment API to verify
                // If SUCCESS:
                contribution.setStatus(ContribStatus.COMPLETED);
                contributionRepository.save(contribution);
                log.info("Mobile Money Contribution {} marked as COMPLETED", contribId);
            }
        } catch (NumberFormatException e) {
            log.error("Unable to parse transaction ID for CinetPay notify");
        }
    }
}
