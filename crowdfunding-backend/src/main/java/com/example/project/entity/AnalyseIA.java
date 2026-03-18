package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Entity representing an AI-driven project analysis.
 * Stores success/risk scores and the full text of the feasibility study.
 */
@Entity
@Table(name = "ai_analysis")
@Data
public class AnalyseIA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "project_id")
    private Projet projet;
    
    @Column(name = "success_score")
    private Float scoreSucces;
    
    @Column(name = "risk_score")
    private Float scoreRisque;
    
    @Column(name = "analysis", columnDefinition = "TEXT")
    private String analyse;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
