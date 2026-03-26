package com.example.project.entity;

import com.example.project.enums.StatutLitige;
import com.example.project.enums.TypeLitige;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entité représentant un litige / conflit sur la plateforme.
 * Les utilisateurs signalent des problèmes et les administrateurs les résolvent ici.
 */
@Entity
@Table(name = "litiges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Litige {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutLitige statut = StatutLitige.NOUVEAU;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeLitige type;

    // L'utilisateur qui déclenche le litige
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plaignant_id", nullable = false)
    private Utilisateur plaignant;

    // L'utilisateur visé par le litige (optionnel, ex: pour une arnaque, c'est le porteur)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accuse_id")
    private Utilisateur accuse;

    // Le projet au centre du conflit le cas échéant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_concerne_id")
    private Projet projetConcerne;

    // La décision finale ou note de l'administrateur
    @Column(columnDefinition = "TEXT")
    private String decisionAdmin;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @Column
    private LocalDateTime dateResolution;
}
