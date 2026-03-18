package com.example.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for creating or updating project milestones (Etapes).
 * Tracks progress and completion status of specific project phases.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de création ou modification d'une étape de projet")
public class EtapesRequestDTO {

    @Schema(description = "Titre de l'étape", example = "Achat du matériel")
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;

    @Schema(description = "Description de ce qui doit être accompli", example = "Acquisition des panneaux solaires et onduleurs.")
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;

    @Schema(description = "Pourcentage d'avancement (0-100)", example = "50")
    private Integer progress;

    @Schema(description = "Indique si l'étape est terminée", example = "false")
    private Boolean estTermine;

    @Schema(description = "ID du projet associé", example = "1")
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
}
