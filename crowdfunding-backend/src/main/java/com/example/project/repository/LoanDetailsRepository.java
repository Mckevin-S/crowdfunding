package com.example.project.repository;

import com.example.project.entity.LoanDetails;
import com.example.project.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoanDetailsRepository extends JpaRepository<LoanDetails, Long> {
    Optional<LoanDetails> findByProjet(Projet projet);
}
