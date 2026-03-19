package com.example.project.service.impl;

import com.example.project.service.interfaces.CurrencyService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementation of {@link CurrencyService}.
 * Currently uses fixed rates for CFA (XAF/XOF) parity and mock rates for others.
 */
@Service
public class CurrencyServiceImpl implements CurrencyService {

    private static final Map<String, BigDecimal> FIXED_RATES = new ConcurrentHashMap<>();

    static {
        FIXED_RATES.put("XAF", BigDecimal.ONE);
        FIXED_RATES.put("XOF", BigDecimal.ONE);
        FIXED_RATES.put("EUR", BigDecimal.valueOf(655.957)); // Fixed parity with CFA
        FIXED_RATES.put("USD", BigDecimal.valueOf(600.00));  // Mock market rate
    }

    @Override
    public BigDecimal convertToXaf(BigDecimal amount, String sourceCurrency) {
        if (amount == null || sourceCurrency == null) return BigDecimal.ZERO;
        
        BigDecimal rate = getRateToXaf(sourceCurrency);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal getRateToXaf(String sourceCurrency) {
        return FIXED_RATES.getOrDefault(sourceCurrency.toUpperCase(), BigDecimal.ONE);
    }
}
