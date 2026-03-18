package com.example.project.repository;

import com.example.project.entity.Utilisateur;
import com.example.project.enums.UserRole;
import com.example.project.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link Utilisateur} entity.
 * Handles user searching by email, role, and account status.
 */
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Utilisateur> findByRole(UserRole role);

    List<Utilisateur> findByStatut(UserStatus statut);

    @Query("SELECT u FROM Utilisateur u WHERE u.role = :role AND u.statut = :statut")
    List<Utilisateur> findByRoleAndStatut(@Param("role") UserRole role, @Param("statut") UserStatus statut);
}
