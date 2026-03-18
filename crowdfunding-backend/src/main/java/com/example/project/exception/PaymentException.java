package com.example.project.exception;

/**
 * Exception levée lors d'une erreur de paiement
 */
public class PaymentException extends BusinessException {

    public PaymentException(String message) {
        super(message);
    }

    public PaymentException(String message, Throwable cause) {
        super(message, cause);
    }
}
