package com.example.project.exception;

/**
 * Exception levée en cas de conflit de données
 * Ex: Email déjà utilisé, projet déjà financé, contribution en double
 */
public class ConflictException extends BusinessException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String resource, String field, Object value) {
        super(String.format("Conflit détecté: %s avec %s '%s' existe déjà", resource, field, value));
    }

    public ConflictException(String action, String reason) {
        super(String.format("Impossible de %s: %s", action, reason));
    }
}