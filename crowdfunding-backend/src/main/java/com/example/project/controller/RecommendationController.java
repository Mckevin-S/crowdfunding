package com.example.project.controller;

import com.example.project.dto.RecommendationRequestDTO;
import com.example.project.dto.RecommendationResponseDTO;
import com.example.project.service.interfaces.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for project recommendations.
 * Manages the suggestion of projects to users based on interest models.
 */
@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "Système de recommandation de projets personnalisés")
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * Manually creates a project recommendation for a user (Admin only).
     *
     * @param request the recommendation details.
     * @return the created recommendation record.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer une recommandation", description = "Ajoute manuellement une recommandation de projet pour un utilisateur (Admin uniquement).")
    @ApiResponse(responseCode = "201", description = "Recommandation créée avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<RecommendationResponseDTO> createRecommendation(
            @Valid @RequestBody RecommendationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recommendationService.createRecommendation(request));
    }

    /**
     * Lists recommendations tailored for a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of recommended projects.
     */
    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Lister les recommandations d'un utilisateur", description = "Affiche les suggestions de projets personnalisées pour un utilisateur.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendationsByUser(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByUser(utilisateurId));
    }

    /**
     * Triggers the recommendation engine to generate new suggestions for a user (Admin only).
     *
     * @param utilisateurId the user ID.
     * @return a success response.
     */
    @PostMapping("/utilisateur/{utilisateurId}/generate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Régénérer les recommandations", description = "Lance l'algorithme de recommandation pour un utilisateur (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> generateRecommendationsForUser(@PathVariable Long utilisateurId) {
        recommendationService.generateRecommendationsForUser(utilisateurId);
        return ResponseEntity.ok().build();
    }
}
