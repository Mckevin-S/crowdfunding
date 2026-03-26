package com.example.project.service.impl;

import com.example.project.dto.StripePaymentIntentRequestDTO;
import com.example.project.dto.StripePaymentIntentResponseDTO;
import com.example.project.entity.Contribution;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.entity.Transaction;
import com.example.project.enums.ContribStatus;
import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutProjet;
import com.example.project.enums.StatutTransaction;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.PaymentException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.repository.ContributionRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.TransactionRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.ContributionService;
import com.example.project.service.interfaces.StripePaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Implementation of {@link StripePaymentService}.
 * Manages the full Stripe payment lifecycle: creating PaymentIntents, tracking
 * contributions,
 * and processing secure webhook events for successful or failed charges.
 */
@Service
@Slf4j
public class StripePaymentServiceImpl implements StripePaymentService {

    private final ContributionRepository contributionRepository;
    private final ProjetRepository projetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TransactionRepository transactionRepository;
    private final ContributionService contributionService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    public StripePaymentServiceImpl(
            ContributionRepository contributionRepository,
            ProjetRepository projetRepository,
            UtilisateurRepository utilisateurRepository,
            TransactionRepository transactionRepository,
            @Lazy ContributionService contributionService) {
        this.contributionRepository = contributionRepository;
        this.projetRepository = projetRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.transactionRepository = transactionRepository;
        this.contributionService = contributionService;
    }

    @Override
    @Transactional
    public StripePaymentIntentResponseDTO createPaymentIntent(StripePaymentIntentRequestDTO dto) {
        log.info(
                "STRIPE_PAYMENT_START: Création d'une intention de paiement pour le projet ID: {}, Utilisateur ID: {}, Montant: {}",
                dto.getProjetId(), dto.getUtilisateurId(), dto.getAmount());

        Projet projet = projetRepository.findById(dto.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", dto.getProjetId()));

        if (projet.getStatut() != StatutProjet.EN_COURS) {
            throw new BadRequestException("Impossible de contribuer : le projet n'est pas EN_COURS");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", dto.getUtilisateurId()));

        if (projet.getPorteur().getId().equals(utilisateur.getId())) {
            throw new BadRequestException("Vous ne pouvez pas contribuer à votre propre projet");
        }

        // Initialize pending contribution locally
        Contribution contribution = Contribution.builder()
                .projet(projet)
                .utilisateur(utilisateur)
                .amount(dto.getAmount())
                .status(ContribStatus.PENDING)
                .paiementType(PaiementType.STRIPE)
                // TODO: set reward if specified
                .build();

        contribution = contributionRepository.save(contribution);

        try {
            // Stripe expects amounts in cents. XAF equivalent logic assuming 1:1 for
            // simplicity or adjusted representation
            // We multiply by 100 for smallest currency unit representing XAF (actually XAF
            // has no cents, but Stripe might expect it depending on config).
            // Let's assume standard integer amount for XAF (Stripe takes integer
            // zero-decimal currencies as is, but assuming generic conversion here).
            // For XAF, Stripe expects the integer amount.
            long amountInSmallestUnit = dto.getAmount().longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInSmallestUnit)
                    .setCurrency("xaf") // Currency matches project context
                    .putMetadata("contributionId", contribution.getId().toString())
                    .putMetadata("projetId", projet.getId().toString())
                    .putMetadata("utilisateurId", utilisateur.getId().toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Update contribution with intent ID
            contribution.setStripePaymentIntentId(intent.getId());
            contributionRepository.save(contribution);

            return StripePaymentIntentResponseDTO.builder()
                    .clientSecret(intent.getClientSecret())
                    .paymentIntentId(intent.getId())
                    .contributionId(contribution.getId())
                    .build();

        } catch (StripeException e) {
            log.error("Failed to create Stripe PaymentIntent: {}", e.getMessage(), e);
            throw new PaymentException("Erreur de communication avec Stripe: " + e.getMessage());
        }
    }

    @Override
    public java.util.Map<String, String> createSimulatedPaymentIntent(java.math.BigDecimal amount, Long contributionId, String userEmail) {
        log.info("[SIMULATION] Création d'un PaymentIntent fictif pour la contribution ID: {}", contributionId);
        
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("clientSecret", "pi_simulated_secret_" + contributionId);
        response.put("id", "pi_simulated_" + contributionId);
        response.put("status", "succeeded"); 
        
        // Update contribution with simulated intent ID in the same way real one does
        Contribution contribution = contributionRepository.findById(contributionId).orElse(null);
        if (contribution != null) {
            contribution.setStripePaymentIntentId("pi_simulated_" + contributionId);
            contributionRepository.save(contribution);
        }
        
        return response;
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature: {}", e.getMessage());
            throw new PaymentException("Signature webhook invalide");
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject == null) {
            log.warn("Deserialization failed for Stripe object");
            return;
        }

        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                handleSuccessfulPayment(paymentIntent);
                break;
            case "payment_intent.payment_failed":
                PaymentIntent failedIntent = (PaymentIntent) stripeObject;
                handleFailedPayment(failedIntent);
                break;
            default:
                log.info("Unhandled Stripe event type: {}", event.getType());
        }
    }

    private void handleSuccessfulPayment(PaymentIntent pi) {
        String contributionIdStr = pi.getMetadata().get("contributionId");
        if (contributionIdStr == null)
            return;

        Long contribId = Long.parseLong(contributionIdStr);
        contributionService.recordSuccessfulContribution(contribId);
    }

    private void handleFailedPayment(PaymentIntent pi) {
        String contributionIdStr = pi.getMetadata().get("contributionId");
        if (contributionIdStr == null)
            return;

        Long contribId = Long.parseLong(contributionIdStr);
        Contribution contribution = contributionRepository.findById(contribId).orElse(null);

        if (contribution != null) {
            contribution.setStatus(ContribStatus.FAILED);
            contributionRepository.save(contribution);
            log.info("Contribution {} marked as failed", contribId);
        }
    }
}
