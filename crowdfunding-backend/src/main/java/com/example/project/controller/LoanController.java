package com.example.project.controller;

import com.example.project.dto.RepaymentScheduleDTO;
import com.example.project.service.interfaces.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for managing Loan-based crowdfunding (Lendwithcare).
 * Handles interest rates, durations, and repayment schedules.
 */
@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
@Tag(name = "Loan Crowdfunding", description = "Gestion des prêts et des remboursements (Crowdlending)")
public class LoanController {

    private final LoanService loanService;

    /**
     * Initializes the loan rules for a project.
     *
     * @param projetId the project ID.
     * @param tauxInteret the annual interest rate (%).
     * @param dureeEnMois the loan duration in months.
     * @param gracePeriod the grace period in months before first repayment.
     * @return a success response.
     */
    @PostMapping("/projects/{projetId}/initialize")
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Initialiser un prêt", description = "Définit le taux d'intérêt, la durée et la période de grâce pour une campagne de prêt.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> initLoan(
            @PathVariable Long projetId,
            @RequestParam BigDecimal tauxInteret,
            @RequestParam Integer dureeEnMois,
            @RequestParam(required = false, defaultValue = "0") Integer gracePeriod) {
        loanService.initializeLoanRules(projetId, tauxInteret, dureeEnMois, gracePeriod);
        return ResponseEntity.ok().build();
    }

    /**
     * Generates the monthly repayment plan for a project (Admin only).
     *
     * @param projetId the project ID.
     * @return a success response.
     */
    @PostMapping("/projects/{projetId}/generate-schedule")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Générer l'échéancier", description = "Crée automatiquement les échéances de remboursement mensuelles (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> generateSchedule(@PathVariable Long projetId) {
        loanService.generateRepaymentSchedule(projetId);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves the repayment schedule for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of repayment installments.
     */
    @GetMapping("/projects/{projetId}/schedule")
    @Operation(summary = "Voir l'échéancier", description = "Récupère la liste des remboursements prévus pour un projet.")
    public ResponseEntity<List<RepaymentScheduleDTO>> getSchedule(@PathVariable Long projetId) {
        return ResponseEntity.ok(loanService.getSchedule(projetId));
    }

    /**
     * Marks a specific repayment installment as paid (Admin only).
     *
     * @param scheduleId the installment ID.
     * @return a success response.
     */
    @PutMapping("/schedule/{scheduleId}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Valider un paiement", description = "Marque une échéance de remboursement comme ayant été payée (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> markPaid(@PathVariable Long scheduleId) {
        loanService.markInstallmentPaid(scheduleId);
        return ResponseEntity.ok().build();
    }
}
