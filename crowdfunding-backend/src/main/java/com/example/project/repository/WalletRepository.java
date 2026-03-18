package com.example.project.repository;

import com.example.project.entity.Wallet;
import com.example.project.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUtilisateur(Utilisateur utilisateur);

    boolean existsByUtilisateur(Utilisateur utilisateur);
}
