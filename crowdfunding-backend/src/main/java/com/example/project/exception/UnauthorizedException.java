package com.example.project.exception;

/**
 * Exception levée pour une opération non autorisée (403)
 */
public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
