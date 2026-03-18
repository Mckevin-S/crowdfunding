package com.example.project.repository;

import com.example.project.entity.Reward;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    List<Reward> findByProjet(Projet projet);

    @Query("SELECT r FROM Reward r WHERE r.projet = :projet ORDER BY r.montantMinimum ASC")
    List<Reward> findByProjetOrderedByAmount(@Param("projet") Projet projet);
}
