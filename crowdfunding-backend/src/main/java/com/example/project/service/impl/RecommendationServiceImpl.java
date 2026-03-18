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
                Recommendation recommendation = new Recommendation();
                recommendation.setUtilisateur(utilisateur);
                recommendation.setProjet(projet);
                recommendation.setScoreAffinite((float) (80.0 + count)); // Dummy score
                recommendationRepository.save(recommendation);
                count++;
            }
        }
    }
}
