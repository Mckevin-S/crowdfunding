package com.example.project.entity;

import com.example.project.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entity representing a reward tier (contrepartie) for a project.
 * Defines minimum contribution amounts, available quantities, and estimated delivery status.
 */
@Entity
@Table(name = "rewards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projet projet;

    @Column(length = 150, nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "minimum_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal montantMinimum;

    /** Quantité disponible (null = illimitée) */
    @Column(name = "quantity")
    private Integer quantite;

    /** Combien ont déjà été réservés */
    @Builder.Default
    @Column(name = "reserved_quantity")
    private Integer quantiteReservee = 0;

    /** Date de livraison estimée */
    @Column(name = "estimated_delivery")
    private LocalDate dateLivraisonEstimee;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status")
    private DeliveryStatus statutLivraison = DeliveryStatus.EN_PREPARATION;

    /** Numéro de suivi de livraison */
    @Column(name = "tracking_number", length = 100)
    private String numeroSuivi;
}
