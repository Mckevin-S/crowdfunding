package com.example.project.controller;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import com.example.project.service.interfaces.UtilisateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for user profile and management operations.
 * Allows users to view/edit their profiles and administrators to manage accounts.
 */
@RestController
@RequestMapping("/api/v1/utilisateurs")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion des profils utilisateurs et administration")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    /**
     * Retrieves the profile of a specific user.
     *
     * @param id the user ID.
     * @return the user profile data.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un profil", description = "Récupère les détails publics d'un profil utilisateur par son ID.")
    @ApiResponse(responseCode = "200", description = "Profil trouvé")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    public ResponseEntity<UtilisateurResponseDTO> getProfil(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.getProfil(id));
    }

    /**
     * Updates the profile of a specific user.
     *
     * @param id the user ID.
     * @param request the update data.
     * @return the updated user profile data.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un profil", description = "Modifie les informations du profil de l'utilisateur.")
    @ApiResponse(responseCode = "200", description = "Profil mis à jour avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UtilisateurResponseDTO> updateProfil(
            @PathVariable Long id,
            @Valid @RequestBody UtilisateurRequestDTO request) {
        return ResponseEntity.ok(utilisateurService.updateProfil(id, request));
    }

    // --- Admin Endpoints ---

    /**
     * Lists all users in the system.
     * Accessible only by ADMINs.
     *
     * @return a list of all users.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Liste tous les utilisateurs", description = "Récupère la liste complète des utilisateurs (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<UtilisateurResponseDTO>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    /**
     * Suspends a user account.
     * Accessible only by ADMINs.
     *
     * @param id the user ID to ban.
     * @return a response with no content.
     */
    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bannir un utilisateur", description = "Désactive le compte d'un utilisateur (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> banUtilisateur(@PathVariable Long id) {
        utilisateurService.banUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Re-activates a suspended user account.
     * Accessible only by ADMINs.
     *
     * @param id the user ID to activate.
     * @return a response with no content.
     */
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Réactiver un utilisateur", description = "Réactive le compte d'un utilisateur précédemment banni (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> activateUtilisateur(@PathVariable Long id) {
        utilisateurService.activateUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}
