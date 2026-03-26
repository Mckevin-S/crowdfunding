package com.example.project.entity;

import com.example.project.enums.ContribStatus;
import com.example.project.enums.PaiementType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a financial contribution from a user to a project.
 * Captures payment metadata for Stripe/CinetPay and links to specific reward tiers or equity shares.
 */
@Entity
@Table(name = "contributions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projet projet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(name = "amount_xaf", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    /** Montant dans la devise d'origine */
    @Column(name = "source_amount", precision = 15, scale = 2)
    private BigDecimal sourceAmount;

    /** Devise d'origine (EUR, USD, XAF, etc.) */
    @Builder.Default
    @Column(name = "source_currency", length = 3)
    private String sourceCurrency = "XAF";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContribStatus status = ContribStatus.PENDING;

    /** Type de paiement utilisé */
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaiementType paiementType;

    /** Identifiant Stripe PaymentIntent (ex: pi_xxx) */
    @Column(name = "stripe_payment_intent_id", length = 100)
    private String stripePaymentIntentId;

    /** Référence Mobile Money CinetPay */
    @Column(name = "mobile_money_reference", length = 100)
    private String mobileMoneReference;

    /** Palier de récompense choisi (null si DON ou autre type) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id")
    private Reward reward;

    /** Nombre d'actions reçues (uniquement pour EQUITY) */
    @Column(name = "shares_received")
    private Long actionsRecues;

    /** Note anonyme (true = le contributeur veut rester anonyme) */
    @Builder.Default
    @Column(name = "anonymous")
    private Boolean anonyme = false;

    @Column(name = "contribution_date", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateContribution;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime dateMiseAJour;
}
