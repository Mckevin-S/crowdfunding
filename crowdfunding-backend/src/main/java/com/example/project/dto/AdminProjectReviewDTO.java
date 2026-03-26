package com.example.project.dto;

import com.example.project.enums.StatutProjet;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande d'administration pour valider, rejeter ou suspendre un projet")
public class AdminProjectReviewDTO {

    @NotNull(message = "Le statut est obligatoire")
    @Schema(description = "Le nouveau statut du projet", example = "AVALIDER")
    private StatutProjet statut;

    @Schema(description = "Notes internes ou motif de rejet/suspension", example = "Projet non conforme aux CGU.")
    private String adminNotes;

    @Schema(description = "Date limite de suspension si applicable", example = "2024-12-31T23:59:59")
    private LocalDateTime suspensionDeadline;
}
