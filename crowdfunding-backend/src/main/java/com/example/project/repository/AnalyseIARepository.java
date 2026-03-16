package com.example.project.repository;

import com.example.project.entity.AnalyseIA;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface AnalyseIARepository extends JpaRepository<AnalyseIA, Long> {
    
    Optional<AnalyseIA> findByProjet(Projet projet);
    
    @Query("SELECT a FROM AnalyseIA a ORDER BY a.scoreSucces DESC")
    List<AnalyseIA> findAnalysisOrderedBySuccessScore();
    
    @Query("SELECT a FROM AnalyseIA a WHERE a.scoreRisque >= :minRisk ORDER BY a.scoreRisque DESC")
    List<AnalyseIA> findHighRiskAnalysis(@Param("minRisk") Float minRisk);
}
