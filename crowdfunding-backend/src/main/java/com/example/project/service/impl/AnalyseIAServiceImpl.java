package com.example.project.service.impl;

import com.example.project.dto.AnalyseIARequestDTO;
import java.util.Objects;
import com.example.project.dto.AnalyseIAResponseDTO;
import com.example.project.entity.AnalyseIA;
import com.example.project.entity.Projet;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.AnalyseIAMapper;
import com.example.project.dto.external.openai.OpenAiRequest;
import com.example.project.dto.external.openai.OpenAiResponse;
import com.example.project.repository.AnalyseIARepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.service.interfaces.AnalyseIAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseIAServiceImpl implements AnalyseIAService {

    private final AnalyseIARepository analyseIARepository;
    private final ProjetRepository projetRepository;
    private final AnalyseIAMapper analyseIAMapper;
    private final WebClient webClient;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:gpt-4}")
    private String model;

    @Override
    @Transactional
    public AnalyseIAResponseDTO analyzeProject(AnalyseIARequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        String prompt = String.format(
                "Agis en tant qu'expert en crowdfunding. Analyse le projet suivant :\n" +
                        "Titre: %s\n" +
                        "Description: %s\n" +
                        "Objectif Financier: %s %s\n" +
                        "Type: %s\n" +
                        "Répond par un JSON formatté strictement comme ceci : {\"score\": 0-100, \"analyse\": \"ta recommandation détaillée\"}",
                projet.getTitre(), projet.getDescription(), projet.getObjectifFinancier(), "FCFA",
                projet.getTypeFinancement());

        String rawAnalysis = "Impossible de contacter l'IA pour le moment.";
        float score = 50.0f;

        if (apiKey != null && !apiKey.startsWith("your_")) {
            try {
                OpenAiRequest aiRequest = OpenAiRequest.builder()
                        .model(model)
                        .messages(List.of(new OpenAiRequest.Message("user", prompt)))
                        .temperature(0.7)
                        .build();

                OpenAiResponse response = webClient.post()
                        .uri("https://api.openai.com/v1/chat/completions")
                        .header("Authorization", "Bearer " + apiKey)
                        .bodyValue(Objects.requireNonNull(aiRequest))
                        .retrieve()
                        .bodyToMono(OpenAiResponse.class)
                        .block();

                if (response != null && !response.getChoices().isEmpty()) {
                    String content = response.getChoices().get(0).getMessage().getContent();
                    // Basic extraction if GPT doesn't respect JSON perfectly
                    rawAnalysis = content;
                    // Note: In a production app, we'd use Jackson to parse the internal JSON from
                    // GPT
                }
            } catch (Exception e) {
                log.error("Erreur lors de l'appel OpenAI: " + e.getMessage());
                rawAnalysis += " (Erreur technique: " + e.getMessage() + ")";
            }
        } else {
            log.warn("Clé API OpenAI non configurée. Utilisation du mode dégradé.");
            rawAnalysis = "Mode démo (Clé API manquante) : Projet prometteur nécessitant plus de détails.";
        }

        AnalyseIA analyse = new AnalyseIA();
        analyse.setProjet(projet);
        analyse.setScoreSucces(score);
        analyse.setAnalyse(rawAnalysis);

        return analyseIAMapper.toResponseDTO(analyseIARepository.save(analyse));
    }

    @Override
    public AnalyseIAResponseDTO getAnalysis(Long id) {
        AnalyseIA analyse = analyseIARepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AnalyseIA", id));
        return analyseIAMapper.toResponseDTO(analyse);
    }

    @Override
    public List<AnalyseIAResponseDTO> getAnalysesByProjet(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        return analyseIARepository.findByProjet(projet).stream()
                .map(analyseIAMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
