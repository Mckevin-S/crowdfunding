package com.example.project.service.impl;

import com.example.project.dto.RecommendationRequestDTO;
import com.example.project.dto.RecommendationResponseDTO;
import com.example.project.entity.Projet;
import com.example.project.entity.Recommendation;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.StatutProjet;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.RecommendationMapper;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.RecommendationRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link RecommendationService}.
 * Provides project suggestions based on active project status and affinity scoring.
 * Implements anti-duplication logic to ensure unique recommendations for users.
 */
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final RecommendationMapper recommendationMapper;
    private final UtilisateurRepository utilisateurRepository;
    private final ProjetRepository projetRepository;

    @Override
    @Transactional
    public RecommendationResponseDTO createRecommendation(RecommendationRequestDTO request) {
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", request.getUtilisateurId()));
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        Recommendation recommendation = recommendationMapper.toEntity(request);
        recommendation.setUtilisateur(utilisateur);
        recommendation.setProjet(projet);

        return recommendationMapper.toResponseDTO(recommendationRepository.save(recommendation));
    }

    @Override
    public List<RecommendationResponseDTO> getRecommendationsByUser(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        return recommendationRepository.findByUtilisateur(utilisateur).stream()
                .map(recommendationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void generateRecommendationsForUser(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        // Simple rule based logic: recommend Top 3 active projects
        List<Projet> activeProjects = projetRepository.findActiveProjectsByStatus(StatutProjet.EN_COURS,
                LocalDate.now());

        int count = 0;
        for (Projet projet : activeProjects) {
            if (count >= 3)
                break;

            // Avoid duplicates
            boolean exists = recommendationRepository.findByUtilisateur(utilisateur).stream()
                    .anyMatch(r -> r.getProjet().getId().equals(projet.getId()));

            if (!exists) {
                float score = calculateAffinityScore(utilisateur, projet);
                
                Recommendation recommendation = new Recommendation();
                recommendation.setUtilisateur(utilisateur);
                recommendation.setProjet(projet);
                recommendation.setScoreAffinite(score);
                recommendationRepository.save(recommendation);
                count++;
            }
        }
    }

    private float calculateAffinityScore(Utilisateur user, Projet project) {
        float score = 50.0f; // Base score

        // Category match (+30)
        if (project.getCategorie() != null && project.getCategorie().equalsIgnoreCase(user.getCategoriePreferee())) {
            score += 30.0f;
        }

        // Location match (+10)
        if (project.getLocalisation() != null && project.getLocalisation().equalsIgnoreCase(user.getVille())) {
            score += 10.0f;
        }

        // Funding progress penalty (max -20 if > 90%)
        if (project.getObjectifFinancier().compareTo(java.math.BigDecimal.ZERO) > 0) {
            double progress = project.getMontantActuel().doubleValue() / project.getObjectifFinancier().doubleValue();
            if (progress > 0.9) {
                score -= 20.0f;
            }
        }

        return Math.max(0, Math.min(100, score));
    }
}
