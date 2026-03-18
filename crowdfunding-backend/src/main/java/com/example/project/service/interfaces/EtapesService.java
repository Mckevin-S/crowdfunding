package com.example.project.service.interfaces;

import com.example.project.dto.EtapesRequestDTO;
import com.example.project.dto.EtapesResponseDTO;

import java.util.List;

/**
 * Service interface for managing project milestones (Etapes).
 * Handles the creation, updates, and tracking of progress for each project phase.
 */
public interface EtapesService {
    /**
     * Creates a new milestone for a project.
     *
     * @param request the milestone details.
     * @return the created milestone.
     */
    EtapesResponseDTO createEtape(EtapesRequestDTO request);

    /**
     * Retrieves a milestone by its ID.
     *
     * @param id the milestone ID.
     * @return the milestone details.
     */
    EtapesResponseDTO getEtape(Long id);

    /**
     * Updates an existing milestone.
     *
     * @param id the milestone ID.
     * @param request the new milestone data.
     * @return the updated milestone.
     */
    EtapesResponseDTO updateEtape(Long id, EtapesRequestDTO request);

    /**
     * Deletes a milestone.
     *
     * @param id the milestone ID.
     */
    void deleteEtape(Long id);

    /**
     * Lists all milestones for a specific project.
     *
     * @param projetId the project ID.
     * @return a list of milestones.
     */
    List<EtapesResponseDTO> getEtapesByProjet(Long projetId);
}
