package com.example.project.entity;

import com.example.project.enums.StatutDocument;
import com.example.project.enums.TypeDocument;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Entity representing a KYC (Know Your Customer) document.
 * Stores the URL of the uploaded document, its type, and current verification status.
 */
@Entity
@Table(name = "kyc_documents")
@Data
public class KycDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type")
    private TypeDocument typeDocument;
    
    @Column(name = "document_url", length = 255)
    private String documentUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatutDocument statut = StatutDocument.EN_ATTENTE;
    
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;
    
    @Column(name = "submitted_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateSoumission;
}
