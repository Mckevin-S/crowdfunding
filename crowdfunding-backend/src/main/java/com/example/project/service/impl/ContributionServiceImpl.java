package com.example.project.service.impl;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import com.example.project.entity.Contribution;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.ContribStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.ContributionMapper;
import com.example.project.repository.ContributionRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.entity.Transaction;
import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutTransaction;
import com.example.project.repository.TransactionRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.CurrencyService;
import com.example.project.service.interfaces.ContributionService;
import com.example.project.util.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link ContributionService}.
 * Manages the persistence of user contributions and provides aggregated data
 * for projects.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContributionServiceImpl implements ContributionService {

        private final ContributionRepository contributionRepository;
        private final ProjetRepository projetRepository;
        private final UtilisateurRepository utilisateurRepository;
        private final TransactionRepository transactionRepository;
        private final ContributionMapper contributionMapper;
        private final PdfGeneratorService pdfGeneratorService;
        private final CurrencyService currencyService;

        @Override
        @Transactional
        public ContributionResponseDTO createContribution(ContributionRequestDTO request) {
                Projet projet = projetRepository.findById(request.getProjetId())
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

                Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur",
                                                request.getUtilisateurId()));

                if (projet.getPorteur().getId().equals(utilisateur.getId())) {
                        throw new BadRequestException("Vous ne pouvez pas contribuer à votre propre projet");
                }

                Contribution contribution = contributionMapper.toEntity(request);
                contribution.setProjet(projet);
                contribution.setUtilisateur(utilisateur);
                contribution.setStatus(ContribStatus.PENDING); // Initial status

                // Multi-currency handling
                String sourceCurrency = request.getCurrency() != null ? request.getCurrency() : "XAF";
                BigDecimal sourceAmount = request.getAmount();
                BigDecimal amountXaf = currencyService.convertToXaf(sourceAmount, sourceCurrency);

                contribution.setSourceAmount(sourceAmount);
                contribution.setSourceCurrency(sourceCurrency);
                contribution.setAmount(amountXaf); // Amount in XAF for project tracking

                return contributionMapper.toResponseDTO(contributionRepository.save(contribution));
        }

        @Override
        public ContributionResponseDTO getContribution(Long id) {
                Contribution contribution = contributionRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Contribution", id));
                return contributionMapper.toResponseDTO(contribution);
        }

        @Override
        public List<ContributionResponseDTO> getContributionsByProjet(Long projetId) {
                Projet projet = projetRepository.findById(projetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
                return contributionRepository.findByProjet(projet).stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ContributionResponseDTO> getContributionsByUtilisateur(Long utilisateurId) {
                Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));
                return contributionRepository.findByUtilisateur(utilisateur).stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ContributionResponseDTO> getAllContributions() {
                return contributionRepository.findAll().stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public BigDecimal getTotalAmountForProjet(Long projetId) {
                Projet projet = projetRepository.findById(projetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
                BigDecimal total = contributionRepository.sumAmountByProjet(projet);
                return total != null ? total : BigDecimal.ZERO;
        }

        @Override
        @Transactional
        public void recordSuccessfulContribution(Long contributionId) {
                Contribution contribution = contributionRepository.findById(contributionId)
                                .orElseThrow(() -> new ResourceNotFoundException("Contribution", contributionId));

                if (contribution.getStatus() != ContribStatus.PENDING) {
                        log.warn("Contribution {} is already processed (status: {})", contributionId,
                                        contribution.getStatus());
                        return;
                }

                // 1. Mark as completed
                contribution.setStatus(ContribStatus.COMPLETED);
                contributionRepository.save(contribution);

                // 2. Update Project Total
                Projet projet = contribution.getProjet();
                BigDecimal current = projet.getMontantActuel() != null ? projet.getMontantActuel() : BigDecimal.ZERO;
                projet.setMontantActuel(current.add(contribution.getAmount()));
                projetRepository.save(projet);

                // 3. Record Transaction
                Transaction transaction = new Transaction();
                transaction.setUtilisateur(contribution.getUtilisateur());
                transaction.setAmount(contribution.getAmount()); // XAF
                transaction.setSourceAmount(contribution.getSourceAmount());
                transaction.setSourceCurrency(contribution.getSourceCurrency());
                transaction.setType(PaiementType.INVESTISSEMENT);
                transaction.setStatus(StatutTransaction.CONFIRMER);
                transactionRepository.save(transaction);

                // 4. Generate PDF Receipt (simulation of generation)
                byte[] receipt = pdfGeneratorService.generateDonationReceipt(
                                contribution.getUtilisateur().getNom(),
                                projet.getTitre(),
                                contribution.getAmount()
                );
                log.info("PDF Receipt generated for contribution {} ({} bytes)", contributionId, receipt.length);
                
                // TODO: Store PDF or send by email
                
                log.info("Successfully recorded contribution {} for project {}", contributionId, projet.getId());
        }
}


                

                