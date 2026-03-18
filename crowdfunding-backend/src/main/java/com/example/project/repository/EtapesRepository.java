package com.example.project.repository;

import com.example.project.entity.Etapes;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EtapesRepository extends JpaRepository<Etapes, Long> {

    List<Etapes> findByProjet(Projet projet);

    @Query("SELECT e FROM Etapes e WHERE e.projet = :projet ORDER BY e.id ASC")
    List<Etapes> findByProjetOrderedByProgress(@Param("projet") Projet projet);

    @Query("SELECT COUNT(e) FROM Etapes e WHERE e.projet = :projet AND e.estTermine = true")
    long countCompletedSteps(@Param("projet") Projet projet);
}
