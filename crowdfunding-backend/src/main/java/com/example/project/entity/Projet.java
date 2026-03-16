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

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Etapes> etapes;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
    private List<Reward> rewards;
}
