package com.example.project.service.interfaces;

/**
 * Service interface for CinetPay payment integration.
 * Enables mobile money and card payments specifically for the African market.
 */
public interface CinetPayService {
    /**
     * Generates a payment link to redirect the user to CinetPay's secure portal.
     *
     * @param contributionId the contribution ID to be paid.
     * @param amount         the amount to charge.
     * @return the generated URL.
     */
    String generatePaymentLink(Long contributionId, java.math.BigDecimal amount);

    /**
     * Processes payment notifications (IPN) from CinetPay.
     *
     * @param transactionId the CinetPay transaction ID.
     */
    void handleNotify(String transactionId);

    /**
     * Initiates a simulated Mobile Money payment for testing.
     */
    java.util.Map<String, String> initiateSimulatedPayment(java.math.BigDecimal amount, Long contributionId, String phoneNumber);
}
