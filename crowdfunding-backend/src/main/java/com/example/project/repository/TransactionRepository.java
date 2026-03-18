package com.example.project.repository;

import com.example.project.entity.Transaction;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUtilisateur(Utilisateur utilisateur);

    List<Transaction> findByStatus(StatutTransaction status);

    List<Transaction> findByType(PaiementType type);

    @Query("SELECT t FROM Transaction t WHERE t.utilisateur = :utilisateur AND t.dateCreation >= :startDate")
    List<Transaction> findRecentTransactionsByUser(@Param("utilisateur") Utilisateur utilisateur,
            @Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.utilisateur = :utilisateur AND t.status = :status")
    java.math.BigDecimal sumAmountByUserAndStatus(@Param("utilisateur") Utilisateur utilisateur,
            @Param("status") StatutTransaction status);
}
