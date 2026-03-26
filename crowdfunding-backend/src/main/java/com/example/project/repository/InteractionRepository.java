package com.example.project.repository;

import com.example.project.entity.Interaction;
import com.example.project.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    Optional<Interaction> findByUtilisateurIdAndProjetIdAndType(Long utilisateurId, Long projetId, InteractionType type);
    long countByProjetIdAndType(Long projetId, InteractionType type);
    List<Interaction> findByProjetIdAndType(Long projetId, InteractionType type);
}
