package com.example.project.service.impl;

import com.example.project.entity.Contribution;
import com.example.project.entity.EquityDetails;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.ContribStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.repository.ContributionRepository;
import com.example.project.repository.EquityDetailsRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.EquityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Implementation of {@link EquityService}.
 * Calculates share distribution based on pre-money valuation and funding progress.
 * Manages the transition from PENDING to COMPLETED status for equity-based contributions.
 */
@Service
@RequiredArgsConstructor
public class EquityServiceImpl implements EquityService {

    private final EquityDetailsRepository equityDetailsRepository;
    private final ProjetRepository projetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ContributionRepository contributionRepository;

    @Override
    @Transactional
    public void initializeEquityRules(Long projetId, BigDecimal valuationPreMoney, BigDecimal pourcentageCapitalOffert,
            Long totalActions, BigDecimal investissementMinimum, BigDecimal investissementMaximumParInvestisseur) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        EquityDetails details = equityDetailsRepository.findByProjet(projet)
                .orElse(new EquityDetails());

        details.setProjet(projet);
        details.setValuationPreMoney(valuationPreMoney);
        details.setPourcentageCapitalOffert(pourcentageCapitalOffert);
        details.setTotalActions(totalActions);
        details.setInvestissementMinimum(investissementMinimum);
        details.setInvestissementMaximumParInvestisseur(investissementMaximumParInvestisseur);

        // Calculate Price Per Share = Pre-Money Valuation / Total Shares
        BigDecimal pricePerShare = valuationPreMoney.divide(BigDecimal.valueOf(totalActions), 2, RoundingMode.HALF_UP);
        details.setPrixParAction(pricePerShare);

        equityDetailsRepository.save(details);
    }

    @Override
    public BigDecimal getSharePrice(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        EquityDetails details = equityDetailsRepository.findByProjet(projet)
                .orElseThrow(() -> new ResourceNotFoundException("Paramètres de capital manquants", projetId));
        return details.getPrixParAction();
    }

    @Override
    public Long calculateSharesForAmount(Long projetId, BigDecimal amount) {
        BigDecimal sharePrice = getSharePrice(projetId);
        if (sharePrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Prix par action invalide");
        }
        // Round down to nearest whole share
        return amount.divide(sharePrice, 0, RoundingMode.DOWN).longValue();
    }

    @Override
    @Transactional
    public void distributeShares(Long projetId, Long utilisateurId, BigDecimal amount) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        EquityDetails details = equityDetailsRepository.findByProjet(projet)
                .orElseThrow(() -> new ResourceNotFoundException("Paramètres de capital manquants", projetId));

        if (amount.compareTo(details.getInvestissementMinimum()) < 0) {
            throw new BadRequestException("Montant inférieur à l'investissement minimum requis");
        }

        if (details.getInvestissementMaximumParInvestisseur() != null
                && amount.compareTo(details.getInvestissementMaximumParInvestisseur()) > 0) {
            throw new BadRequestException("Montant supérieur à l'investissement maximum par investisseur");
        }

        Long sharesToDistribute = calculateSharesForAmount(projetId, amount);

        // Check if enough shares are available in the offered pool
        BigDecimal offeredPoolDecimals = BigDecimal.valueOf(details.getTotalActions()).multiply(
                details.getPourcentageCapitalOffert().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        long offeredPool = offeredPoolDecimals.longValue();

        if (details.getActionsDistribuees() + sharesToDistribute > offeredPool) {
            throw new BadRequestException("Nombre d'actions disponibles insuffisant pour ce montant");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        // Find completed contribution without shares assigned
        Contribution contribution = contributionRepository.findByProjetAndUtilisateur(projet, utilisateur).stream()
                .filter(c -> c.getStatus() == ContribStatus.COMPLETED && c.getActionsRecues() == null)
                // In exact implementation, we should match by specific contribution ID rather
                // than sum/any
                .findFirst()
                .orElseThrow(() -> new BadRequestException(
                        "Aucune contribution finalisée valide trouvée pour attribuer ces actions"));

        // Assign shares
        contribution.setActionsRecues(sharesToDistribute);
        contributionRepository.save(contribution);

        details.setActionsDistribuees(details.getActionsDistribuees() + sharesToDistribute);

        // Update Post money valuation = Pre Money + Current Amount raised
        details.setValuationPostMoney(details.getValuationPreMoney().add(projet.getMontantActuel()));
        equityDetailsRepository.save(details);
    }
}
