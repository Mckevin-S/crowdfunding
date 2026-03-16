package com.example.project.entity;

import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String motsDePasse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus statut = UserStatus.ACTIVE;
    
    @Column(name = "first_name", length = 100)
    private String prenom;
    
    @Column(name = "last_name", length = 100)
    private String nom;
    
    @Column(name = "phone", length = 20)
    private String telephone;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(length = 255)
    private String address;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateCreation;
}
