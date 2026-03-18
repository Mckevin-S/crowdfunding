package com.example.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing a single installment in a loan repayment schedule.
 * Tracks due dates, capital/interest breakdown, and payment status.
 */
@Entity
@Table(name = "repayment_schedule")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projet projet;

    /** Numéro de l'échéance (1, 2, ..., N) */
    @Column(name = "installment_number", nullable = false)
    private Integer numeroEcheance;

    /** Date d'échéance */
    @Column(name = "due_date", nullable = false)
    private LocalDate dateEcheance;

    /** Montant total de l'échéance (capital + intérêts) */
    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal montantTotal;

    /** Part en capital */
    @Column(name = "principal_amount", precision = 15, scale = 2)
    private BigDecimal montantCapital;

    /** Part en intérêts */
    @Column(name = "interest_amount", precision = 15, scale = 2)
    private BigDecimal montantInterets;

    /** Capital restant dû après cette échéance */
    @Column(name = "remaining_principal", precision = 15, scale = 2)
    private BigDecimal capitalRestant;

    /** Statut: PENDING, PAID, OVERDUE, RESCHEDULED */
    @Column(name = "status", length = 20)
    private String statut = "PENDING";

    /** Date de paiement effectif (null si non payé) */
    @Column(name = "paid_at")
    private LocalDateTime datePaiement;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
