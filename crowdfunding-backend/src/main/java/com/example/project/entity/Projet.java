package com.example.project.entity;

import com.example.project.enums.StatutProjet;
import com.example.project.enums.TypeFinancement;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing a crowdfunding project.
 * Tracks funding progress, financial goals, and maintains relationships with milestones (Etapes) and rewards.
 */
@Entity
@Table(name = "projects")
@Data
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Utilisateur porteur;
    
    @Column(length = 200)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "funding_goal", precision = 15, scale = 2)
    private BigDecimal objectifFinancier;
    
    @Column(name = "current_amount", precision = 15, scale = 2)
    private BigDecimal montantActuel = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "funding_type")
    private TypeFinancement typeFinancement;
    
    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal tauxInteret;

    @Column(name = "equity_percentage", precision = 5, scale = 2)
    private BigDecimal partCapitalOuverte;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatutProjet statut;
    
    @Column(name = "start_date")
    private LocalDate dateDebut;
    
    @Column(name = "end_date")
    private LocalDate dateFin;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;

    @Column(name = "all_or_nothing")
    private boolean allOrNothing = true;

    @Column(length = 50)
    private String categorie;

    @Column(length = 100)
    private String localisation;

    @Column(name = "cover_image")
    private String imageCouverture;

    @Column(name = "investors_count")
    private Integer nombreContributeurs = 0;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Etapes> etapes;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Reward> rewards;
}
