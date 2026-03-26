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
import com.example.project.enums.TypeFinancement;
import com.example.project.repository.TransactionRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.CurrencyService;
import com.example.project.service.interfaces.NotificationService;
import com.example.project.dto.NotificationRequestDTO;
import com.example.project.service.interfaces.ContributionService;
import com.example.project.util.PdfGeneratorService;
import com.example.project.service.interfaces.StripePaymentService;
import com.example.project.service.interfaces.CinetPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        private final StripePaymentService stripePaymentService;
        private final CinetPayService cinetPayService;
        private final NotificationService notificationService;

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
        public ContributionResponseDTO initiateContribution(ContributionRequestDTO request) {
                log.info("INITIATE_START: Request={}", request);
                // 1. Validations de base
                Projet projet = projetRepository.findById(request.getProjetId())
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

                Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur",
                                                request.getUtilisateurId()));

                log.info("INITIATE_VAL: Projet={}, Utilisateur={}", projet.getTitre(), utilisateur.getEmail());

                // 2. Vérification KYC (Plafond et Investissement)
                boolean requiresKyc = request.getAmount().compareTo(new BigDecimal(500000)) > 0
                                || TypeFinancement.LOAN.equals(projet.getTypeFinancement())
                                || TypeFinancement.EQUITY.equals(projet.getTypeFinancement());

                if (requiresKyc && !"APPROVED".equals(utilisateur.getKycStatus())) {
                        throw new BadRequestException(
                                        "Veuillez valider votre profil KYC pour investir en capital/prêt ou plus de 500,000 XAF.");
                }

                // 3. Création enregistrement PENDING
                Contribution contribution = contributionMapper.toEntity(request);
                contribution.setProjet(projet);
                contribution.setUtilisateur(utilisateur);
                contribution.setStatus(ContribStatus.PENDING);
                contribution.setAmount(request.getAmount()); // Directement en XAF

                log.info("INITIATE_SAVE_PRE");
                contribution = contributionRepository.save(contribution);
                log.info("INITIATE_SAVE_POST: ID={}", contribution.getId());

                // 4. Simulation Paiement selon le type
                Map<String, String> paymentData = new HashMap<>();
                if (PaiementType.STRIPE.equals(request.getPaiementType())) {
                        log.info("INITIATE_STRIPE");
                        paymentData = stripePaymentService.createSimulatedPaymentIntent(request.getAmount(),
                                        contribution.getId(), utilisateur.getEmail());
                } else if (PaiementType.MOBILE_MONEY.equals(request.getPaiementType())) {
                        log.info("INITIATE_MOBILE");
                        paymentData = cinetPayService.initiateSimulatedPayment(request.getAmount(),
                                        contribution.getId(), utilisateur.getTelephone());
                }

                log.info("INITIATE_MAP_PRE");
                ContributionResponseDTO response = contributionMapper.toResponseDTO(contribution);
                log.info("INITIATE_MAP_POST");
                response.setPaymentMetadata(paymentData);
                return response;
        }

        @Override
        @Transactional
        public void recordSuccessfulContribution(Long contributionId) {
                Contribution contribution = contributionRepository.findById(contributionId)
                                .orElseThrow(() -> new ResourceNotFoundException("Contribution", contributionId));

                if (contribution.getStatus() != ContribStatus.PENDING) {
                        return;
                }

                contribution.setStatus(ContribStatus.COMPLETED);
                contributionRepository.save(contribution);

                // Mettre à jour le projet parent
                Projet projet = contribution.getProjet();
                projet.setMontantActuel(projet.getMontantActuel().add(contribution.getAmount()));
                projet.setNombreContributeurs(projet.getNombreContributeurs() + 1);
                projetRepository.save(projet);

                // Transaction Historique
                Transaction trans = new Transaction();
                trans.setUtilisateur(contribution.getUtilisateur());
                trans.setAmount(contribution.getAmount());
                trans.setType(contribution.getPaiementType());
                trans.setStatus(StatutTransaction.CONFIRMER);
                transactionRepository.save(trans);

                // --- NOTIFICATIONS ---
                try {
                        // Notify Owner
                        String ownerMsg = String.format(
                                        "🎉 Nouvelle contribution ! Vous avez reçu %s XAF pour votre projet '%s'.",
                                        contribution.getAmount().toString(), projet.getTitre());
                        notificationService.createNotification(
                                        new NotificationRequestDTO(projet.getPorteur().getId(), ownerMsg, false));

                        // Notify Contributor
                        String contribMsg = String.format(
                                        "✔️ Merci ! Votre contribution de %s XAF pour le projet '%s' est confirmée.",
                                        contribution.getAmount().toString(), projet.getTitre());
                        notificationService.createNotification(new NotificationRequestDTO(
                                        contribution.getUtilisateur().getId(), contribMsg, false));
                } catch (Exception e) {
                        // Log but don't fail transaction
                }
        }
}
