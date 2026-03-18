package com.example.project.controller;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import com.example.project.service.interfaces.ContributionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for managing project contributions.
 * Handles tracking and retrieval of all financial support transactions.
 */
@RestController
@RequestMapping("/api/v1/contributions")
@RequiredArgsConstructor
@Tag(name = "Contributions", description = "Suivi des paiements et soutiens financiers aux projets")
public class ContributionController {

    private final ContributionService contributionService;

    /**
     * Creates a new contribution record (usually called by payment services).
     *
     * @param request the contribution details.
     * @return the created contribution data.
     */
    @PostMapping
    @Operation(summary = "Enregistrer une contribution", description = "Crée manuellement une contribution (réservé aux services internes ou d'administration).")
    @ApiResponse(responseCode = "201", description = "Contribution enregistrée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ContributionResponseDTO> createContribution(
            @Valid @RequestBody ContributionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contributionService.createContribution(request));
    }

    /**
     * Retrieves a single contribution by ID.
     *
     * @param id the contribution ID.
     * @return the contribution data.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'une contribution", description = "Récupère les informations d'un paiement spécifique.")
    @ApiResponse(responseCode = "200", description = "Contribution trouvée")
    public ResponseEntity<ContributionResponseDTO> getContribution(@PathVariable Long id) {
        return ResponseEntity.ok(contributionService.getContribution(id));
    }

    /**
     * Lists all contributions in the system.
     *
     * @return a list of all contributions.
     */
    @GetMapping
    @Operation(summary = "Lister toutes les contributions", description = "Récupère l'historique complet de tous les paiements effectués sur la plateforme.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<ContributionResponseDTO>> getAllContributions() {
        return ResponseEntity.ok(contributionService.getAllContributions());
    }

    /**
     * Lists all contributions for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of contributions for the project.
     */
    @GetMapping("/projet/{projetId}")
    @Operation(summary = "Lister les contributions d'un projet", description = "Affiche tous les soutiens financiers reçus pour une campagne spécifique.")
    public ResponseEntity<List<ContributionResponseDTO>> getContributionsByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(contributionService.getContributionsByProjet(projetId));
    }

    /**
     * Lists all contributions made by a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of user contributions.
     */
    @GetMapping("/utilisateur/{utilisateurId}")
    @Operation(summary = "Lister les contributions d'un utilisateur", description = "Affiche l'historique des paiements effectués par un contributeur spécifique.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<ContributionResponseDTO>> getContributionsByUtilisateur(
            @PathVariable Long utilisateurId) {
        return ResponseEntity.ok(contributionService.getContributionsByUtilisateur(utilisateurId));
    }

    /**
     * Calculates the total amount raised by a project.
     *
     * @param projetId the project ID.
     * @return the total sum of contributions.
     */
    @GetMapping("/projet/{projetId}/total")
    @Operation(summary = "Somme totale des contributions", description = "Calcule le montant cumulé récolté par une campagne.")
    public ResponseEntity<BigDecimal> getTotalAmountForProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(contributionService.getTotalAmountForProjet(projetId));
    }
}
