package com.example.project.entity;

import com.example.project.enums.ContribStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contributions")
@Data
public class Contribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projet projet;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private ContribStatus status;
    
    @Column(name = "contribution_date", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateContribution;
}
