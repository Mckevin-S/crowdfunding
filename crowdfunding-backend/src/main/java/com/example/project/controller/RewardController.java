package com.example.project.controller;

import com.example.project.dto.RewardRequestDTO;
import com.example.project.dto.RewardResponseDTO;
import com.example.project.enums.DeliveryStatus;
import com.example.project.service.interfaces.RewardService;
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
 * REST Controller for managing project rewards.
 * Handles reward creation, updates, and delivery tracking.
 */
@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Rewards", description = "Gestion des contreparties et récompenses des projets")
public class RewardController {

    private final RewardService rewardService;

    /**
     * Creates a new reward for a project.
     *
     * @param request the reward details.
     * @return the created reward data.
     */
    @PostMapping
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Créer une contrepartie", description = "Définit une nouvelle récompense pour les contributeurs d'un projet.")
    @ApiResponse(responseCode = "201", description = "Contrepartie créée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<RewardResponseDTO> createReward(@Valid @RequestBody RewardRequestDTO request) {
        log.info("REWARD_CREATE: Nouvelle récompense pour le projet ID: {}, Titre: {}",
                request.getProjetId(), request.getTitre());
        return ResponseEntity.status(HttpStatus.CREATED).body(rewardService.createReward(request));
    }

    /**
     * Retrieves details of a specific reward.
     *
     * @param id the reward ID.
     * @return the reward details.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une contrepartie", description = "Récupère les informations d'une récompense spécifique.")
    public ResponseEntity<RewardResponseDTO> getReward(@PathVariable Long id) {
        return ResponseEntity.ok(rewardService.getReward(id));
    }

    /**
     * Lists all rewards available for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of rewards for the project.
     */
    @GetMapping("/projet/{projetId}")
    @Operation(summary = "Lister les contreparties d'un projet", description = "Récupère toutes les récompenses proposées par une campagne.")
    public ResponseEntity<List<RewardResponseDTO>> getRewardsByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(rewardService.getRewardsByProjet(projetId));
    }

    /**
     * Updates an existing reward.
     *
     * @param id      the reward ID.
     * @param request the update data.
     * @return the updated reward data.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour une contrepartie", description = "Modifie les détails d'une récompense existante.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<RewardResponseDTO> updateReward(
            @PathVariable Long id,
            @Valid @RequestBody RewardRequestDTO request) {
        log.info("REWARD_UPDATE: Mise à jour de la récompense ID: {}", id);
        return ResponseEntity.ok(rewardService.updateReward(id, request));
    }

    /**
     * Deletes a reward.
     *
     * @param id the reward ID to delete.
     * @return no content on success.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Supprimer une contrepartie", description = "Retire une récompense du projet.")
    @ApiResponse(responseCode = "204", description = "Contrepartie supprimée")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        log.info("REWARD_DELETE: Suppression de la récompense ID: {}", id);
        rewardService.deleteReward(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Associates a reward with a specific contribution.
     *
     * @param rewardId       the reward ID.
     * @param contributionId the contribution ID.
     * @return a success response.
     */
    @PostMapping("/{rewardId}/claim/{contributionId}")
    @Operation(summary = "Réclamer une contrepartie", description = "Lie une récompense à une contribution effectuée.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> claimReward(
            @PathVariable Long rewardId,
            @PathVariable Long contributionId) {
        log.info("REWARD_CLAIM: Réclamation de la récompense ID: {} pour la contribution ID: {}",
                rewardId, contributionId);
        rewardService.claimReward(rewardId, contributionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates the delivery status of a reward.
     *
     * @param rewardId       the reward ID.
     * @param status         the new delivery status.
     * @param trackingNumber optional tracking number.
     * @return a success response.
     */
    @PatchMapping("/{rewardId}/delivery")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour le statut de livraison", description = "Indique si une récompense a été envoyée ou reçue.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> updateDeliveryStatus(
            @PathVariable Long rewardId,
            @RequestParam DeliveryStatus status,
            @RequestParam(required = false) String trackingNumber) {
        log.info("REWARD_DELIVERY_UPDATE: Statut de livraison pour la récompense ID: {} changé vers {}",
                rewardId, status);
        rewardService.updateDeliveryStatus(rewardId, status, trackingNumber);
        return ResponseEntity.ok().build();
    }
}
