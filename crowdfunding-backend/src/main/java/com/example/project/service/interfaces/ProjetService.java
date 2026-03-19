package com.example.project.service.interfaces;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.enums.StatutProjet;

import java.util.List;

/**
 * Service interface for managing crowdfunding projects.
 * Orchestrates the project lifecycle from creation to funding and completion.
 */
public interface ProjetService {
    /**
     * Registers a new project in the platform.
     *
     * @param request the project details.
     * @return the created project response.
     */
    ProjetResponseDTO createProjet(ProjetRequestDTO request);

    /**
     * Retrieves a project by its unique ID.
     *
     * @param id the project ID.
     * @return the project details.
     */
    ProjetResponseDTO getProjet(Long id);

    /**
     * Updates an existing project's information.
     *
     * @param id the project ID.
     * @param request the new project data.
     * @return the updated project response.
     */
    ProjetResponseDTO updateProjet(Long id, ProjetRequestDTO request);

    /**
     * Removes a project from the system (logical or physical deletion).
     *
     * @param id the project ID.
     */
    void deleteProjet(Long id);

    /**
     * Lists all projects registered on the platform.
     *
     * @return a list of all projects.
     */
    List<ProjetResponseDTO> getAllProjets();

    /**
     * Retrieves all projects submitted by a specific project owner (porteur).
     *
     * @param porteurId the user ID of the project owner.
     * @return a list of projects.
     */
    List<ProjetResponseDTO> getProjetsByPorteur(Long porteurId);

    /**
     * Filters and returns only the projects that are currently open for funding.
     *
     * @return a list of active projects.
     */
    List<ProjetResponseDTO> getActiveProjets();

    /**
     * Updates the workflow status of a project (e.g., PENDING -> VALIDATED).
     *
     * @param id the project ID.
     * @param nouveauStatut the new status to apply.
     * @return the updated project response.
     */
    ProjetResponseDTO updateStatut(Long id, StatutProjet nouveauStatut);

    /**
     * Periodically closes projects that have reached their end date.
     * Implements All-or-Nothing policy checks.
     */
    void closeExpiredProjects();
}
