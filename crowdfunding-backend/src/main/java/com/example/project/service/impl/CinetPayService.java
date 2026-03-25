package com.example.project.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CinetPayService {

    public Map<String, String> initiateMobileMoneyPayment(BigDecimal amount, Long contributionId, String phoneNumber) {
        log.info("[SIMULATION] Initiation paiement Mobile Money (CinetPay) pour le numéro: {}", phoneNumber);
        
        Map<String, String> response = new HashMap<>();
        response.put("payment_url", "https://cinetpay.com/simulated-payment/" + UUID.randomUUID());
        response.put("transaction_id", "CP-" + contributionId);
        response.put("status", "ACCEPTED");
        
        return response;
    }
}
