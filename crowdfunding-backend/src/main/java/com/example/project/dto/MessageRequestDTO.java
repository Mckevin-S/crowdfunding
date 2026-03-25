package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande d'envoi d'un message")
public class MessageRequestDTO {

    @Schema(description = "ID de l'expéditeur", example = "1")
    @NotNull(message = "L'ID de l'expéditeur ne doit pas être nul")
    private Long expediteurId;

    @Schema(description = "ID du destinataire", example = "2")
    @NotNull(message = "L'ID du destinataire ne doit pas être nul")
    private Long destinataireId;

    @Schema(description = "ID du projet concerné (facultatif)", example = "3")
    private Long projetId;

    @Schema(description = "Contenu du message", example = "Bonjour, j'aimerais en savoir plus...")
    @NotBlank(message = "Le contenu ne peut pas être vide")
    private String contenu;
}
