package com.example.project.enums;

/**
 * Définit la nature du litige.
 */
public enum TypeLitige {
    /** Non livraison d'une contrepartie ou remboursement demandé */
    REMBOURSEMENT,
    /** Suspicion de fraude par rapport à un projet */
    ARNAQUE,
    /** Comportement inapproprié, discours haineux, infraction des CGU */
    VIOLATION_CGU,
    /** Litige technique ou autre */
    AUTRE
}
