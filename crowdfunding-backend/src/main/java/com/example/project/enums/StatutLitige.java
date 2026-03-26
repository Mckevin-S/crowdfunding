package com.example.project.enums;

/**
 * Définit les différents statuts possibles pour un litige.
 */
public enum StatutLitige {
    /** Le litige vient d'être ouvert */
    NOUVEAU,
    /** Le litige est en cours d'examen par un administrateur */
    EN_COURS,
    /** Le litige a été tranché et cloturé */
    RESOLU,
    /** Le litige est considéré comme infondé et fermé */
    REJETE
}
