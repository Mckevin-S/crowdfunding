package com.example.project.exception;

/**
 * Exception levée pour les erreurs de requête invalide
 * Ex: Données manquantes, format incorrect, contraintes non respectées
 */
public class BadRequestException extends BusinessException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String field, String reason) {
        super(String.format("Champ '%s' invalide: %s", field, reason));
    }

    public BadRequestException(String field, Object value, String expected) {
        super(String.format("Champ '%s' invalide. Valeur reçue: %s, attendu: %s", field, value, expected));
    }
}