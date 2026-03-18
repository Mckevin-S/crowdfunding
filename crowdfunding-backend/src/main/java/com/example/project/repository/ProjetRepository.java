package com.example.project.repository;

import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.StatutProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for {@link Projet} entity.
 * Provides custom queries for searching active projects and project owners.
 */
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByPorteur(Utilisateur porteur);

    List<Projet> findByStatut(StatutProjet statut);

    @Query("SELECT p FROM Projet p WHERE p.statut = :statut AND p.dateFin >= :today")
    List<Projet> findActiveProjectsByStatus(@Param("statut") StatutProjet statut, @Param("today") LocalDate today);

    @Query("SELECT p FROM Projet p WHERE p.porteur = :porteur ORDER BY p.id DESC")
    List<Projet> findProjectsByOwner(@Param("porteur") Utilisateur porteur);

    @Query("SELECT p FROM Projet p WHERE p.montantActuel >= p.objectifFinancier")
    List<Projet> findFundedProjects();
}
