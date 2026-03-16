package com.example.project.entity;

import com.example.project.enums.TypeDocument;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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
    
    @Column(name = "is_verified")
    private Boolean estVerifie = false;
    
    @Column(name = "submitted_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateSoumission;
}
