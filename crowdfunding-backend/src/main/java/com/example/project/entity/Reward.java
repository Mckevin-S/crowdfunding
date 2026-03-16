package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "rewards")
@Data
public class Reward {
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
    
    @Column(name = "minimum_amount", precision = 10, scale = 2)
    private BigDecimal montantMinimum;
    
    @Column(name = "quantity")
    private Integer quantite;
}
