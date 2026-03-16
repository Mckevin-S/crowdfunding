package com.example.project.repository;

import com.example.project.entity.Contribution;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.ContribStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    
    List<Contribution> findByProjet(Projet projet);
    
    List<Contribution> findByUtilisateur(Utilisateur utilisateur);
    
    List<Contribution> findByStatus(ContribStatus status);
    
    @Query("SELECT c FROM Contribution c WHERE c.projet = :projet AND c.utilisateur = :utilisateur")
    List<Contribution> findByProjetAndUtilisateur(@Param("projet") Projet projet, @Param("utilisateur") Utilisateur utilisateur);
    
    @Query("SELECT COUNT(c) FROM Contribution c WHERE c.projet = :projet AND c.status = :status")
    long countByProjetAndStatus(@Param("projet") Projet projet, @Param("status") ContribStatus status);
    
    @Query("SELECT SUM(c.amount) FROM Contribution c WHERE c.projet = :projet")
    java.math.BigDecimal sumAmountByProjet(@Param("projet") Projet projet);
}
