package com.example.project.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Utility class for consistent logging across the application.
 * Provides methods for logging business events, performance metrics, and security events.
 */
@Slf4j
@Component
public class LoggingUtil {

    /**
     * Log an info-level business event
     */
    public static void logBusinessEvent(String event, Long userId, String details) {
        log.info("BUSINESS_EVENT: [{}] User: {} | Details: {}", event, userId, details);
    }

    /**
     * Log a security event (auth, access denial, etc.)
     */
    public static void logSecurityEvent(String event, Long userId, String ipAddress, String details) {
        log.warn("SECURITY_EVENT: [{}] User: {} | IP: {} | Details: {}", event, userId, ipAddress, details);
    }

    /**
     * Log a payment-related event
     */
    public static void logPaymentEvent(String event, Long contributionId, String paymentIntentId, String status) {
        log.info("PAYMENT_EVENT: [{}] Contribution: {} | PaymentIntent: {} | Status: {}", 
            event, contributionId, paymentIntentId, status);
    }

    /**
     * Log database operation metrics
     */
    public static void logDatabaseOperation(String operation, String entity, long duration) {
        log.debug("DATABASE_OP: [{}] Entity: {} | Duration: {}ms", operation, entity, duration);
    }

    /**
     * Log error with context
     */
    public static void logError(String context, String message, Exception exception) {
        log.error("ERROR [{}]: {} | Exception: {}", context, message, exception.getMessage(), exception);
    }

    /**
     * Log API call metrics
     */
    public static void logApiCall(String method, String endpoint, int statusCode, long duration) {
        log.info("API_CALL: {} {} | Status: {} | Duration: {}ms", method, endpoint, statusCode, duration);
    }

    /**
     * Log validation error
     */
    public static void logValidationError(String entity, String field, String error) {
        log.warn("VALIDATION_ERROR: Entity: {} | Field: {} | Error: {}", entity, field, error);
    }

    /**
     * Log performance warning (slow operation)
     */
    public static void logPerformanceWarning(String operation, long duration, long threshold) {
        log.warn("PERFORMANCE_WARNING: [{}] Duration: {}ms | Threshold: {}ms", operation, duration, threshold);
    }

    /**
     * Log business rule violation
     */
    public static void logBusinessRuleViolation(String rule, String details) {
        log.warn("BUSINESS_RULE_VIOLATION: [{}] Details: {}", rule, details);
    }
}
