package com.example.project.service.interfaces;

import com.example.project.dto.AnalyseIARequestDTO;
import com.example.project.dto.AnalyseIAResponseDTO;

import java.util.List;

/**
 * Service interface for AI-driven project analysis.
 * Handles the generation and retrieval of technical and financial feasibility studies.
 */
public interface AnalyseIAService {
    /**
     * Analyzes a project using AI models to determine success and risk scores.
     *
     * @param request the analysis request containing project details.
     * @return the result of the AI analysis.
     */
    AnalyseIAResponseDTO analyzeProject(AnalyseIARequestDTO request);

    /**
     * Retrieves a specific AI analysis by its ID.
     *
     * @param id the analysis ID.
     * @return the analysis details.
     */
    AnalyseIAResponseDTO getAnalysis(Long id);

    /**
     * Lists all AI analyses for a given project.
     *
     * @param projetId the project ID.
     * @return a list of analysis responses.
     */
    List<AnalyseIAResponseDTO> getAnalysesByProjet(Long projetId);

    /**
     * Interacts with the AI for a general chat or project-specific context.
     *
     * @param message  The user message.
     * @param projetId The project ID (optional).
     * @return The AI's response text.
     */
    String chatWithAI(String message, Long projetId);
}
