package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "project_steps")
@Data
public class Etapes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projet projet;
    
    @Column(length = 150)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Integer progress;
    
    @Column(name = "is_completed")
    private Boolean estTermine = false;
}
