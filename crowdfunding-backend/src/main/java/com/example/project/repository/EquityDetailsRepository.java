package com.example.project.repository;

import com.example.project.entity.EquityDetails;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EquityDetailsRepository extends JpaRepository<EquityDetails, Long> {
    Optional<EquityDetails> findByProjet(Projet projet);
}
