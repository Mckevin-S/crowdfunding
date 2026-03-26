package com.example.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Entity representing specific parameters for EQUITY (equity-based) crowdfunding projects.
 * Tracks valuation details, share prices, and distribution counts for investors.
 */
@Entity
@Table(name = "equity_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquityDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "project_id", unique = true, nullable = false)
    private Projet projet;

    /** Valorisation pré-money (XAF) */
    @Column(name = "pre_money_valuation", precision = 20, scale = 2, nullable = false)
    private BigDecimal valuationPreMoney;

    /** Pourcentage du capital offert aux investisseurs (ex: 25.0 pour 25%) */
    @Column(name = "equity_percentage_offered", precision = 5, scale = 2, nullable = false)
    private BigDecimal pourcentageCapitalOffert;

    /** Nombre total d'actions de la société */
    @Column(name = "total_shares", nullable = false)
    private Long totalActions;

    /** Prix par action (XAF) calculé = valuation_post_money / total_shares */
    @Column(name = "price_per_share", precision = 15, scale = 2)
    private BigDecimal prixParAction;

    /** Valorisation post-money = pre_money + montant levé */
    @Column(name = "post_money_valuation", precision = 20, scale = 2)
    private BigDecimal valuationPostMoney;

    /** Montant minimum d'investissement (XAF) */
    @Column(name = "min_investment", precision = 15, scale = 2)
    private BigDecimal investissementMinimum;

    /** Montant maximum par investisseur (XAF) */
    @Column(name = "max_investment_per_investor", precision = 15, scale = 2)
    private BigDecimal investissementMaximumParInvestisseur;

    /** Nombre d'actions déjà distribuées aux investisseurs crowdfunding */
    @Builder.Default
    @Column(name = "distributed_shares")
    private Long actionsDistribuees = 0L;
}
