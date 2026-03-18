package com.example.project.exception;

/**
 * Exception levée quand une ressource n'est pas trouvée (404)
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s avec l'ID %d introuvable", resource, id));
    }

    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s avec %s='%s' introuvable", resource, field, value));
    }
}
