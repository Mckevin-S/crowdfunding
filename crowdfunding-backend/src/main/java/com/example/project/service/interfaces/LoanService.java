package com.example.project.service.interfaces;

import com.example.project.dto.RepaymentScheduleDTO;
import java.util.List;

/**
 * Service interface for managing loan-based crowdfunding projects.
 * Handles repayment schedule generation and interest calculations.
 */
public interface LoanService {
    /**
     * Sets the loan terms for a project.
     *
     * @param projetId the project ID.
     * @param tauxInteret the annual interest rate.
     * @param dureeEnMois the loan duration in months.
     * @param gracePeriod the grace period (in months) before first repayment.
     */
    void initializeLoanRules(Long projetId, java.math.BigDecimal tauxInteret, Integer dureeEnMois, Integer gracePeriod);

    /**
     * Generates the periodic repayment schedule for a funded project.
     *
     * @param projetId the project ID.
     */
    void generateRepaymentSchedule(Long projetId);

    /**
     * Retrieves the repayment schedule for a project.
     *
     * @param projetId the project ID.
     * @return a list of scheduled payments.
     */
    List<RepaymentScheduleDTO> getSchedule(Long projetId);

    /**
     * Marks a specific installment as paid.
     *
     * @param scheduleId the repayment schedule entry ID.
     */
    void markInstallmentPaid(Long scheduleId);
}
