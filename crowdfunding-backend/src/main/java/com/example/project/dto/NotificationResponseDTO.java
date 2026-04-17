package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for notification response data.
 * Represents a message sent to a user, including its read status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'une notification")
public class NotificationResponseDTO {
    
    @Schema(description = "Identifiant de la notification", example = "1")
    private Long id;
    
    @Schema(description = "ID de l'utilisateur destinataire", example = "1")
    private Long utilisateurId;
    
    @Schema(description = "Message de la notification", example = "Bienvenue sur la plateforme !")
    private String message;
    
    @Schema(description = "Indique si la notification a été lue", example = "false")
    private Boolean estLu;

    @Schema(description = "Catégorie/type de notification", example = "INFO")
    private String categorie;

    @Schema(description = "Date d'envoi", example = "2026-03-17T12:00:00")
    private LocalDateTime dateCreation;
}
