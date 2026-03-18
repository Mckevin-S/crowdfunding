package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity representing a project recommendation for a user.
 * Stores an affinity score calculated by the recommendation engine.
 */
@Entity
@Table(name = "recommendations")
@Data
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "score_affinite")
    private Float scoreAffinite;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;
}
