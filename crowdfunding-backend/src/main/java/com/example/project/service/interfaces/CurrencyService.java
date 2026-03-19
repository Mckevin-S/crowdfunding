package com.example.project.service.interfaces;

import java.math.BigDecimal;

/**
 * Service to handle currency conversions based on official BEAC/BCEAO parity or market rates.
 */
public interface CurrencyService {
    /**
     * Converts an amount from a source currency to XAF.
     */
    BigDecimal convertToXaf(BigDecimal amount, String sourceCurrency);

    /**
     * Gets the current exchange rate from source currency to XAF.
     */
    BigDecimal getRateToXaf(String sourceCurrency);
}
