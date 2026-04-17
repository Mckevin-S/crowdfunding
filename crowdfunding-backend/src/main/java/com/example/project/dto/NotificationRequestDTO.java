package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for sending a user notification.
 * Used to trigger alerts, updates, or messages for a specific user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande d'envoi d'une notification")
public class NotificationRequestDTO {
    
    @Schema(description = "ID de l'utilisateur destinataire", example = "1")
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;
    
    @Schema(description = "Contenu du message de notification", example = "Votre projet a été validé !")
    @NotBlank(message = "Le message ne doit pas être vide")
    private String message;

    @Schema(description = "Catégorie/type de notification", example = "INFO")
    private String categorie = "INFO";

    @Schema(description = "Envoyer également un email ?", example = "false")
    private boolean sendEmail = false;
}
