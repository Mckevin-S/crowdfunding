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
import com.example.project.repository.RewardRepository;
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
        private final RewardRepository rewardRepository;
        private final ContributionMapper contributionMapper;
        private final PdfGeneratorService pdfGeneratorService;
        private final CurrencyService currencyService;
        private final StripePaymentService stripePaymentService;
        private final CinetPayService cinetPayService;
        private final NotificationService notificationService;

        @Override
        @Transactional
        public ContributionResponseDTO createContribution(ContributionRequestDTO request) {
                // ... (création manuelle si besoin)
                return null;
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
                contribution.setAmount(request.getAmount());

                // Gestion de la récompense
                if (request.getRewardId() != null) {
                        record Reward(Long id) {
                        } // Temporary structure if needed, or just find
                        contribution.setReward(rewardRepository.findById(request.getRewardId()).orElse(null));
                }

                contribution = contributionRepository.save(contribution);
                log.info("INITIATE_SAVE_SUCCESS: ID={}", contribution.getId());

                // 4. Simulation Paiement selon le type (avec Try-Catch pour éviter 500)
                Map<String, String> paymentData = new HashMap<>();
                try {
                        if (PaiementType.STRIPE.equals(request.getPaiementType())) {
                                log.info("INITIATE_STRIPE_SIMULATION");
                                paymentData = stripePaymentService.createSimulatedPaymentIntent(
                                                request.getAmount(), contribution.getId(), utilisateur.getEmail());
                        } else if (PaiementType.MOBILE_MONEY.equals(request.getPaiementType())) {
                                log.info("INITIATE_MOBILE_SIMULATION");
                                paymentData = cinetPayService.initiateSimulatedPayment(
                                                request.getAmount(), contribution.getId(), utilisateur.getTelephone());
                        }
                } catch (Exception e) {
                        log.error("PAYMENT_SIMULATION_ERROR: {}", e.getMessage(), e);
                        // On ne bloque pas tout le processus en simulation
                        paymentData.put("status", "SIMULATION_FAILED");
                        paymentData.put("error", e.getMessage());
                }

                ContributionResponseDTO response = contributionMapper.toResponseDTO(contribution);
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
                                        new NotificationRequestDTO(projet.getPorteur().getId(), ownerMsg, true));

                        // Notify Contributor
                        String contribMsg = String.format(
                                        "Merci ! Votre contribution de %s XAF pour le projet '%s' est confirmée.",
                                        contribution.getAmount().toString(), projet.getTitre());
                        notificationService.createNotification(new NotificationRequestDTO(
                                        contribution.getUtilisateur().getId(), contribMsg, true));
                } catch (Exception e) {
                        // Log but don't fail transaction
                }
        }
}
