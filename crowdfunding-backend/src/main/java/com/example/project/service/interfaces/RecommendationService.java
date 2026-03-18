package com.example.project.service.interfaces; // syntax fix

import com.example.project.dto.RecommendationRequestDTO;
import com.example.project.dto.RecommendationResponseDTO;

import java.util.List;

/**
 * Service interface for project recommendations.
 * Uses user interest profiles and historical data to suggest relevant projects.
 */
public interface RecommendationService {
    /**
     * Manually creates a recommendation record for a user.
     *
     * @param request the recommendation details.
     * @return the created recommendation.
     */
    RecommendationResponseDTO createRecommendation(RecommendationRequestDTO request);

    /**
     * Retrieves a list of recommendations tailored for a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of recommended projects.
     */
    List<RecommendationResponseDTO> getRecommendationsByUser(Long utilisateurId);

    /**
     * Triggers the recommendation engine to refresh suggestions for a user.
     *
     * @param utilisateurId the user ID.
     */
    void generateRecommendationsForUser(Long utilisateurId);
}
