package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Entity representing a system notification for a user.
 * Stores the message content and tracks whether it has been read.
 */
@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;
    

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    private String categorie; // ex: INFO, ALERTE, SYSTEME, etc.
    
    @Column(name = "is_read")
    private Boolean estLu = false;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
