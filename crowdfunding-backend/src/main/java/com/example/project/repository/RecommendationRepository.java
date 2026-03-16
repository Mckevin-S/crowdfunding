package com.example.project.repository;

import com.example.project.entity.Recommendation;
import com.example.project.entity.Utilisateur;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    List<Recommendation> findByUtilisateur(Utilisateur utilisateur);
    
    Optional<Recommendation> findByUtilisateurAndProjet(Utilisateur utilisateur, Projet projet);
    
    @Query("SELECT r FROM Recommendation r WHERE r.utilisateur = :utilisateur ORDER BY r.scoreAffinite DESC")
    List<Recommendation> findTopRecommendationsForUser(@Param("utilisateur") Utilisateur utilisateur);
    
    @Query("SELECT r FROM Recommendation r WHERE r.projet = :projet ORDER BY r.scoreAffinite DESC")
    List<Recommendation> findRecommendationsForProject(@Param("projet") Projet projet);
}
