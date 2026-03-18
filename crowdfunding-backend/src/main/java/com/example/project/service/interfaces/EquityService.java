package com.example.project.service.interfaces;

/**
 * Service interface for managing equity-based crowdfunding rules and distributions.
 * Handles share price calculation and shareholder record management.
 */
public interface EquityService {
    /**
     * Configures the equity rules for a new project.
     *
     * @param projetId the project ID.
     * @param valuationPreMoney the initial company valuation.
     * @param pourcentageCapitalOffert percentage of company offered for funding.
     * @param totalActions total number of shares to be issued.
     * @param investissementMinimum minimum investment allowed.
     * @param investissementMaximumParInvestisseur maximum investment per investor cap.
     */
    void initializeEquityRules(
            Long projetId,
            java.math.BigDecimal valuationPreMoney,
            java.math.BigDecimal pourcentageCapitalOffert,
            Long totalActions,
            java.math.BigDecimal investissementMinimum,
            java.math.BigDecimal investissementMaximumParInvestisseur);

    /**
     * Calculates the current price per share for a project.
     *
     * @param projetId the project ID.
     * @return the calculated share price.
     */
    java.math.BigDecimal getSharePrice(Long projetId);

    /**
     * Determines how many shares an investor receives for a given amount.
     *
     * @param projetId the project ID.
     * @param amount the investment amount.
     * @return the number of shares.
     */
    Long calculateSharesForAmount(Long projetId, java.math.BigDecimal amount);

    /**
     * Records the distribution of shares to an investor.
     *
     * @param projetId the project ID.
     * @param utilisateurId the investor ID.
     * @param amount the investment amount used to calculate shares.
     */
    void distributeShares(Long projetId, Long utilisateurId, java.math.BigDecimal amount);
}
