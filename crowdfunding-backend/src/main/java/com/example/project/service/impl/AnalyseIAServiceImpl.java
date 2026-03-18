package com.example.project.service.impl;

import com.example.project.dto.AnalyseIARequestDTO;
import com.example.project.dto.AnalyseIAResponseDTO;
import com.example.project.entity.AnalyseIA;
import com.example.project.entity.Projet;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.AnalyseIAMapper;
import com.example.project.repository.AnalyseIARepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.service.interfaces.AnalyseIAService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link AnalyseIAService}.
 * Uses a heuristic approach to evaluate project success based on description length and financial targets.
 */
@Service
@RequiredArgsConstructor
public class AnalyseIAServiceImpl implements AnalyseIAService {

    private final AnalyseIARepository analyseIARepository;
    private final ProjetRepository projetRepository;

    @Override
    @Transactional
    public AnalyseIAResponseDTO analyzeProject(AnalyseIARequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        // Simple rule-based scoring mock
        double score = 50.0;
        StringBuilder recommendations = new StringBuilder("Recommandations générées par IA: \n");

        if (projet.getDescription() != null && projet.getDescription().length() > 200) {
            score += 20.0;
            recommendations.append("- Excellente description détaillée.\n");
        } else {
            recommendations.append("- La description devrait être plus longue pour rassurer les investisseurs.\n");
        }

        if (projet.getObjectifFinancier() != null && projet.getObjectifFinancier().doubleValue() < 5000000) {
            score += 15.0;
            recommendations.append("- Objectif financier réaliste et atteignable.\n");
        } else {
            score -= 5.0;
            recommendations.append("- Objectif très élevé, prévoyez un marketing intensif.\n");
        }

        AnalyseIA analyse = new AnalyseIA();
        analyse.setProjet(projet);
        analyse.setScoreSucces((float) score);
        analyse.setAnalyse(recommendations.toString());

        return AnalyseIAMapper.INSTANCE.toResponseDTO(analyseIARepository.save(analyse));
    }

    @Override
    public AnalyseIAResponseDTO getAnalysis(Long id) {
        AnalyseIA analyse = analyseIARepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AnalyseIA", id));
        return AnalyseIAMapper.INSTANCE.toResponseDTO(analyse);
    }

    @Override
    public List<AnalyseIAResponseDTO> getAnalysesByProjet(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        return analyseIARepository.findByProjet(projet).stream()
                .map(AnalyseIAMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
