package com.example.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Entity representing specific parameters for LOAN (debt-based) crowdfunding projects.
 * Tracks interest rates, durations, and calculated monthly installments.
 */
@Entity
@Table(name = "loan_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "project_id", unique = true, nullable = false)
    private Projet projet;

    /** Taux d'intérêt annuel en % (ex: 10.5 pour 10.5%) */
    @Column(name = "annual_interest_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal tauxInteret;

    /** Durée du prêt en mois */
    @Column(name = "duration_months", nullable = false)
    private Integer dureeEnMois;

    /** Période de grâce en mois (pas de remboursement pendant cette période) */
    @Column(name = "grace_period_months")
    private Integer periodeGrace = 0;

    /** Fréquence de remboursement: MONTHLY, QUARTERLY, ANNUALLY */
    @Column(name = "repayment_frequency", length = 20)
    private String frequenceRemboursement = "MONTHLY";

    /** Mensualité calculée automatiquement */
    @Column(name = "monthly_payment", precision = 15, scale = 2)
    private BigDecimal mensualite;

    /** Total à rembourser (capital + intérêts) */
    @Column(name = "total_repayment", precision = 15, scale = 2)
    private BigDecimal totalRemboursement;

    /** Coût total du crédit (intérêts uniquement) */
    @Column(name = "total_interest", precision = 15, scale = 2)
    private BigDecimal totalInterets;

    /** Description des garanties (informatif) */
    @Column(name = "guarantees", columnDefinition = "TEXT")
    private String garanties;

    /** Taux de pénalité en cas de retard (% additionnel) */
    @Column(name = "penalty_rate", precision = 5, scale = 2)
    private BigDecimal tauxPenalite = BigDecimal.valueOf(2.0);

    /** Seuil de jours avant déclenchement du contentieux */
    @Column(name = "default_threshold_days")
    private Integer seuilDefautJours = 90;
}
