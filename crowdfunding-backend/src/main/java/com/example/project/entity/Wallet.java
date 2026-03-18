package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a user's virtual wallet.
 * Holds the current balance available for investments or withdrawals.
 */
@Entity
@Table(name = "wallets")
@Data
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private Utilisateur utilisateur;
    
    @Column(name = "balance", precision = 15, scale = 2)
    private BigDecimal solde = BigDecimal.ZERO;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
