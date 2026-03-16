package com.example.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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
    
    @Column(name = "is_read")
    private Boolean estLu = false;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
