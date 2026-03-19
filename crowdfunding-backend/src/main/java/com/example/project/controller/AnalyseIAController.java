package com.example.project.controller;

import com.example.project.dto.AnalyseIARequestDTO;
import com.example.project.dto.AnalyseIAResponseDTO;
import com.example.project.service.interfaces.AnalyseIAService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for AI-driven project analysis.
 * Provides insights into technical feasibility and financial risks using machine learning models.
 */
@RestController
@RequestMapping("/api/v1/analyses-ia")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Analysis", description = "Analyses de projets par intelligence artificielle")
public class AnalyseIAController {

    private final AnalyseIAService analyseIAService;

    /**
     * Triggers or updates an AI analysis for a specific project.
     *
     * @param request the analysis data.
     * @return the generated analysis results.
     */
    @PostMapping
    @PreAuthorize("hasRole('PORTEUR_PROJET') or hasRole('ADMIN')")
    @Operation(summary = "Analyser un projet", description = "Lance ou met à jour une analyse IA pour un projet spécifique.")
    @ApiResponse(responseCode = "201", description = "Analyse générée avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<AnalyseIAResponseDTO> analyzeProject(@Valid @RequestBody AnalyseIARequestDTO request) {
        log.info("AI_ANALYSIS_REQUEST: Lancement d'une analyse IA pour le projet ID: {}", request.getProjetId());
        return ResponseEntity.status(HttpStatus.CREATED).body(analyseIAService.analyzeProject(request));
    }

    /**
     * Retrieves a specific AI analysis by its ID.
     *
     * @param id the analysis ID.
     * @return the analysis details.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une analyse", description = "Récupère les détails d'une analyse IA spécifique.")
    public ResponseEntity<AnalyseIAResponseDTO> getAnalysis(@PathVariable Long id) {
        return ResponseEntity.ok(analyseIAService.getAnalysis(id));
    }

    /**
     * Lists all AI analyses associated with a project.
     *
     * @param projetId the project ID.
     * @return a list of analyses.
     */
    @GetMapping("/projet/{projetId}")
    @Operation(summary = "Lister les analyses d'un projet", description = "Affiche l'historique des analyses IA pour un projet donné.")
    public ResponseEntity<List<AnalyseIAResponseDTO>> getAnalysesByProjet(@PathVariable Long projetId) {
        return ResponseEntity.ok(analyseIAService.getAnalysesByProjet(projetId));
    }
}
