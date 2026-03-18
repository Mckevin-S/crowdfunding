package com.example.project.repository;

import com.example.project.entity.Projet;
import com.example.project.entity.RepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, Long> {
    List<RepaymentSchedule> findByProjetOrderByNumeroEcheanceAsc(Projet projet);

    List<RepaymentSchedule> findByProjetAndStatut(Projet projet, String statut);
}
