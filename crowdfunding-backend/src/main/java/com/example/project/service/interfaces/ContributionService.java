package com.example.project.service.interfaces;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for managing project contributions.
 * Handles the logic for creating financial supports and tracking funding progress.
 */
public interface ContributionService {
    /**
     * Records a new contribution for a project.
     *
     * @param request the contribution details.
     * @return the created contribution record.
     */
    ContributionResponseDTO createContribution(ContributionRequestDTO request);

    /**
     * Retrieves a specific contribution by its ID.
     *
     * @param id the contribution ID.
     * @return the contribution details.
     */
    ContributionResponseDTO getContribution(Long id);

    /**
     * Lists all contributions for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of contributions.
     */
    List<ContributionResponseDTO> getContributionsByProjet(Long projetId);

    /**
     * Lists all contributions made by a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of contributions.
     */
    List<ContributionResponseDTO> getContributionsByUtilisateur(Long utilisateurId);

    /**
     * Lists all contributions across the entire platform.
     *
     * @return a list of all contributions.
     */
    List<ContributionResponseDTO> getAllContributions();

    /**
     * Calculates the total amount raised for a specific project.
     *
     * @param projetId the project ID.
     * @return the sum of all successful contributions.
     */
    BigDecimal getTotalAmountForProjet(Long projetId);

    /**
     * Finalizes a successful contribution.
     * Updates project funding, records transaction, and generates receipt.
     *
     * @param contributionId the ID of the confirmed contribution.
     */
    void recordSuccessfulContribution(Long contributionId);
}
