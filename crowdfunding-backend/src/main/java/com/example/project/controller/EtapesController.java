package com.example.project.controller;

import com.example.project.dto.EtapesRequestDTO;
import com.example.project.dto.EtapesResponseDTO;
import com.example.project.service.interfaces.EtapesService;
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
 * REST Controller for managing project milestones.
 * Allows project owners to define and update development steps.
 */
@RestController
@RequestMapping("/api/v1/etapes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Etapes", description = "Suivi des étapes d'avancement des projets")
public class EtapesController {

    private final EtapesService etapesService;

    /**
     * Creates a new milestone for a project.
     *
     * @param request the milestone details.
     * @return the created milestone data.
     */
    @PostMapping
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Créer une étape", description = "Ajoute une nouvelle étape de développement à un projet.")
    @ApiResponse(responseCode = "201", description = "Etape créée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EtapesResponseDTO> createEtape(@Valid @RequestBody EtapesRequestDTO request) {
        log.info("ETAPE_CREATE: Nouvelle étape pour le projet ID: {}, Titre: {}", 
                request.getProjetId(), request.getTitre());
        return ResponseEntity.status(HttpStatus.CREATED).body(etapesService.createEtape(request));
    }

    /**
     * Retrieves a specific milestone by ID.
     *
     * @param id the milestone ID.
     * @return the milestone details.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une étape", description = "Récupère les détails d'une étape spécifique.")
    public ResponseEntity<EtapesResponseDTO> getEtape(@PathVariable Long id) {
        return ResponseEntity.ok(etapesService.getEtape(id));
    }

    /**
     * Lists all milestones for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of milestones for the project.
     */
    @GetMapping("/projet/{projetId}")
    @Operation(summary = "Lister les étapes d'un projet", description = "Récupère toutes les étapes associées à une campagne de crowdfunding.")
    public ResponseEntity<List<EtapesResponseDTO>> getEtapesByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(etapesService.getEtapesByProjet(projetId));
    }

    /**
     * Updates an existing milestone.
     *
     * @param id the milestone ID.
     * @param request the update data.
     * @return the updated milestone data.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour une étape", description = "Modifie le titre, la description ou l'avancement d'une étape.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EtapesResponseDTO> updateEtape(
            @PathVariable Long id,
            @Valid @RequestBody EtapesRequestDTO request) {
        log.info("ETAPE_UPDATE: Mise à jour de l'étape ID: {}", id);
        return ResponseEntity.ok(etapesService.updateEtape(id, request));
    }

    /**
     * Deletes a milestone.
     *
     * @param id the milestone ID to delete.
     * @return no content on success.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Supprimer une étape", description = "Retire une étape du projet.")
    @ApiResponse(responseCode = "204", description = "Etape supprimée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteEtape(@PathVariable Long id) {
        log.info("ETAPE_DELETE: Suppression de l'étape ID: {}", id);
        etapesService.deleteEtape(id);
        return ResponseEntity.noContent().build();
    }
}
