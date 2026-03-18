package com.example.project.controller;

import com.example.project.service.interfaces.EquityService;
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
 * REST Controller for managing Equity-based crowdfunding.
 * Handles valuation, offering percentages, and share distribution.
 */
@RestController
@RequestMapping("/api/v1/equity")
@RequiredArgsConstructor
@Tag(name = "Equity Crowdfunding", description = "Gestion des investissements en capital (actions)")
public class EquityController {

    private final EquityService equityService;

    /**
     * Initializes the equity rules for a project.
     *
     * @param projetId the project ID.
     * @param valuationPreMoney the pre-money valuation.
     * @param pourcentageCapitalOffert the percentage of capital offered to investors.
     * @param totalActions the total number of shares to create.
     * @param investissementMinimum the minimum investment per person.
     * @param investissementMaximumParInvestisseur optional maximum investment.
     * @return a success response.
     */
    @PostMapping("/projects/{projetId}/initialize")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Initialiser les règles d'Equity", description = "Définit la valorisation, le pourcentage offert et les limites d'investissement pour un projet d'Equity.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> initEquity(
            @PathVariable Long projetId,
            @RequestParam BigDecimal valuationPreMoney,
            @RequestParam BigDecimal pourcentageCapitalOffert,
            @RequestParam Long totalActions,
            @RequestParam BigDecimal investissementMinimum,
            @RequestParam(required = false) BigDecimal investissementMaximumParInvestisseur) {

        equityService.initializeEquityRules(
                projetId, valuationPreMoney, pourcentageCapitalOffert, totalActions, investissementMinimum,
                investissementMaximumParInvestisseur);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves the current share price for an equity project.
     *
     * @param id the project ID.
     * @return the price per share.
     */
    @GetMapping("/projects/{id}/share-price")
    @Operation(summary = "Prix de l'action", description = "Calcule le prix unitaire d'une action basé sur la valorisation et le nombre d'actions.")
    public ResponseEntity<BigDecimal> getSharePrice(@PathVariable Long id) {
        return ResponseEntity.ok(equityService.getSharePrice(id));
    }

    /**
     * Calculates how many shares a specific amount would purchase.
     *
     * @param projetId the project ID.
     * @param amount the investment amount.
     * @return the number of shares.
     */
    @GetMapping("/projects/{projetId}/calculate-shares")
    @Operation(summary = "Calculer les actions", description = "Simule le nombre d'actions obtenues pour un montant d'investissement donné.")
    public ResponseEntity<Long> calculateShares(@PathVariable Long projetId, @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(equityService.calculateSharesForAmount(projetId, amount));
    }

    /**
     * Manually distributes shares to a user (Admin only).
     *
     * @param projetId the project ID.
     * @param utilisateurId the investor's user ID.
     * @param amount the investment amount.
     * @return a success response.
     */
    @PostMapping("/projects/{projetId}/distribute")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Distribuer des actions", description = "Attribue officiellement des parts de capital à un investisseur (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> distributeShares(
            @PathVariable Long projetId,
            @RequestParam Long utilisateurId,
            @RequestParam BigDecimal amount) {
        equityService.distributeShares(projetId, utilisateurId, amount);
        return ResponseEntity.ok().build();
    }
}
