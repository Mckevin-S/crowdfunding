package com.example.project.controller;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.enums.StatutProjet;
import com.example.project.service.interfaces.ProjetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing projects.
 * Handles creation, retrieval, updates, and deletion of crowdfunding projects.
 */
@RestController
@RequestMapping("/api/v1/projets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Projets", description = "Gestion des campagnes de crowdfunding")
public class ProjetController {

    private final ProjetService projetService;

    /**
     * Creates a new crowdfunding project.
     *
     * @param request the project creation details.
     * @return the created project data.
     */
    @PostMapping
    @Operation(summary = "Créer un nouveau projet", description = "Initialise une nouvelle campagne de crowdfunding.")
    @ApiResponse(responseCode = "210", description = "Projet créé avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ProjetResponseDTO> createProjet(@Valid @RequestBody ProjetRequestDTO request) {
        log.info("CREATION_PROJET: Initialisation d'un nouveau projet '{}'", request.getTitre());
        return ResponseEntity.status(HttpStatus.CREATED).body(projetService.createProjet(request));
    }

    /**
     * Retrieves details of a specific project.
     *
     * @param id the project ID.
     * @return the project details.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'un projet", description = "Récupère toutes les informations relatives à une campagne spécifique.")
    @ApiResponse(responseCode = "200", description = "Projet trouvé")
    @ApiResponse(responseCode = "404", description = "Projet non trouvé")
    public ResponseEntity<ProjetResponseDTO> getProjet(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.getProjet(id));
    }

    /**
     * Updates an existing project's information.
     *
     * @param id the project ID.
     * @param request the update data.
     * @return the updated project data.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un projet", description = "Modifie les caractéristiques d'une campagne existante.")
    @ApiResponse(responseCode = "200", description = "Projet mis à jour")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ProjetResponseDTO> updateProjet(
            @PathVariable Long id, 
            @Valid @RequestBody ProjetRequestDTO request) {
        log.info("UPDATE_PROJET: Mise à jour du projet ID: {}", id);
        return ResponseEntity.ok(projetService.updateProjet(id, request));
    }

    /**
     * Deletes a project from the system.
     *
     * @param id the project ID to delete.
     * @return no content on success.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un projet", description = "Retire définitivement une campagne du système.")
    @ApiResponse(responseCode = "204", description = "Projet supprimé")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        log.info("DELETE_PROJET: Suppression du projet ID: {}", id);
        projetService.deleteProjet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lists all projects in the system.
     *
     * @return a list of all projects.
     */
    @GetMapping
    @Operation(summary = "Lister tous les projets", description = "Récupère la liste de toutes les campagnes enregistrées.")
    public ResponseEntity<List<ProjetResponseDTO>> getAllProjets() {
        return ResponseEntity.ok(projetService.getAllProjets());
    }

    /**
     * Lists only projects that are currently active.
     *
     * @return a list of active projects.
     */
    @GetMapping("/active")
    @Operation(summary = "Lister les projets actifs", description = "Récupère les campagnes dont le statut est 'AVALIDER' ou 'EN_COURS'.")
    public ResponseEntity<List<ProjetResponseDTO>> getActiveProjets() {
        return ResponseEntity.ok(projetService.getActiveProjets());
    }

    /**
     * Lists all projects belonging to a specific project owner.
     *
     * @param porteurId the owner's user ID.
     * @return a list of projects for the given owner.
     */
    @GetMapping("/porteur/{porteurId}")
    @Operation(summary = "Lister les projets d'un porteur", description = "Récupère toutes les campagnes créées par un utilisateur spécifique.")
    public ResponseEntity<List<ProjetResponseDTO>> getProjetsByPorteur(@PathVariable Long porteurId) {
        return ResponseEntity.ok(projetService.getProjetsByPorteur(porteurId));
    }

    /**
     * Updates the status of a project (Admin only).
     *
     * @param id the project ID.
     * @param statut the new status to apply.
     * @return the updated project data.
     */
    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifier le statut d'un projet", description = "Permet à un administrateur de valider ou rejeter un projet.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ProjetResponseDTO> updateStatut(
            @PathVariable Long id, 
            @RequestParam StatutProjet statut) {
        log.info("UPDATE_STATUT_PROJET: Changement de statut pour le projet ID: {} vers {}", id, statut);
        return ResponseEntity.ok(projetService.updateStatut(id, statut));
    }
}
