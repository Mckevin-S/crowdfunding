package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Projet projet;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime dateCreation;
}
