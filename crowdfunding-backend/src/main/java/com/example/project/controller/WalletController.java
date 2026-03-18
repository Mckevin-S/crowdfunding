package com.example.project.controller;

import com.example.project.service.interfaces.WalletService;
import com.example.project.dto.WalletResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * REST Controller for digital wallet management.
 * Allows users to view their balance, add funds, or withdraw money.
 */
@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
@Tag(name = "Portefeuilles", description = "Gestion des portefeuilles virtuels et du solde utilisateur")
public class WalletController {

    private final WalletService walletService;

    /**
     * Retrieves the wallet of a specific user.
     *
     * @param utilisateurId the user ID.
     * @return the wallet data.
     */
    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Obtenir mon portefeuille", description = "Récupère le solde et les informations du portefeuille d'un utilisateur.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<WalletResponseDTO> getWalletByUtilisateurId(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(walletService.getWalletByUtilisateurId(utilisateurId));
    }

    /**
     * Increases the funds available in the wallet.
     *
     * @param utilisateurId the user ID.
     * @param amount the sum to add.
     * @return the updated wallet data.
     */
    @PostMapping("/utilisateur/{utilisateurId}/add-funds")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Approvisionner le portefeuille", description = "Ajoute des fonds au solde du portefeuille virtuel.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<WalletResponseDTO> addFunds(
            @PathVariable Long utilisateurId,
            @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(walletService.addFunds(utilisateurId, amount));
    }

    /**
     * Withdraws money from the wallet.
     *
     * @param utilisateurId the user ID.
     * @param amount the sum to withdraw.
     * @return the updated wallet data.
     */
    @PostMapping("/utilisateur/{utilisateurId}/withdraw")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Retrait de fonds", description = "Débite le solde du portefeuille virtuel pour un virement externe.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<WalletResponseDTO> withdrawFunds(
            @PathVariable Long utilisateurId,
            @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(walletService.withdrawFunds(utilisateurId, amount));
    }
}
