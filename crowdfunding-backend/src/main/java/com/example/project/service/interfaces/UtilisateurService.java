package com.example.project.service.interfaces;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import java.util.List;

/**
 * Service interface for user profile and administrative management.
 * Handles profile retrieval, updates, and account lifecycle (ban/activate).
 */
public interface UtilisateurService {
    /**
     * Retrieves the profile information for a specific user.
     *
     * @param id the user ID.
     * @return the user profile details.
     */
    UtilisateurResponseDTO getProfil(Long id);

    /**
     * Updates user personal and profile information.
     *
     * @param id the user ID.
     * @param request the new user data.
     * @return the updated profile.
     */
    UtilisateurResponseDTO updateProfil(Long id, UtilisateurRequestDTO request);

    /**
     * Lists all registered users (Admin only).
     *
     * @return a list of all users.
     */
    List<UtilisateurResponseDTO> getAllUtilisateurs();

    /**
     * Suspend's a user's account access.
     *
     * @param id the user ID.
     */
    void banUtilisateur(Long id);

    /**
     * Restores access for a suspended user account.
     *
     * @param id the user ID.
     */
    void activateUtilisateur(Long id);
}
