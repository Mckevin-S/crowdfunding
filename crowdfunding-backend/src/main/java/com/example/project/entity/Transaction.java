package com.example.project.entity;

import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutTransaction;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a financial transaction (deposit, withdrawal, or investment).
 * Records the user, amount, payment type, and final status.
 */
@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private PaiementType type;
    
    @Enumerated(EnumType.STRING)
    private StatutTransaction status;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
