package com.example.project.repository;

import com.example.project.entity.PasswordResetToken;
import com.example.project.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByTokenAndUtilisateur_Email(String token, String email);
    Optional<PasswordResetToken> findByUtilisateur(Utilisateur utilisateur);
    void deleteByUtilisateur(Utilisateur utilisateur);
}
