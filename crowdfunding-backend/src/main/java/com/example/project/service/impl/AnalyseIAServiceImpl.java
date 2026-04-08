package com.example.project.service.impl;

import com.example.project.dto.AnalyseIARequestDTO;
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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
@Slf4j
public class AnalyseIAServiceImpl implements AnalyseIAService {

    private final AnalyseIARepository analyseIARepository;
    private final ProjetRepository projetRepository;
    private final AnalyseIAMapper analyseIAMapper;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:gpt-4}")
    private String model;

    public AnalyseIAServiceImpl(
            AnalyseIARepository analyseIARepository,
            ProjetRepository projetRepository,
            AnalyseIAMapper analyseIAMapper,
            WebClient webClient,
            ObjectMapper objectMapper) {
        this.analyseIARepository = analyseIARepository;
        this.projetRepository = projetRepository;
        this.analyseIAMapper = analyseIAMapper;
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public AnalyseIAResponseDTO analyzeProject(AnalyseIARequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        String prompt = String.format(
                "Agis en tant qu'expert en crowdfunding et analyste financier senior. Analyse de manière critique le projet suivant :\n" +
                        "Titre: %s\n" +
                        "Description: %s\n" +
                        "Objectif Financier: %s %s\n" +
                        "Type: %s\n\n" +
                        "Répond EXCLUSIVEMENT sous forme d'un objet JSON plat avec ces clés exactes :\n" +
                        "\"score_succes\": (nombre entre 0 et 100 representing SUCCESS potential),\n" +
                        "\"score_risque\": (nombre entre 0 et 100 representing RISK level),\n" +
                        "\"analyse\": \"(une analyse détaillée de 3-4 paragraphes incluant SWOT et stratégie recommandées)\"",
                projet.getTitre(), projet.getDescription(), projet.getObjectifFinancier(), "FCFA",
                projet.getTypeFinancement());

        String rawAnalysis = "Impossible de contacter l'IA pour le moment.";
        float successScore = 50.0f;
        float riskScore = 30.0f;

        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("your_")) {
            try {
                OpenAiRequest aiRequest = OpenAiRequest.builder()
                        .model(model)
                        .messages(List.of(new OpenAiRequest.Message("user", prompt)))
                        .temperature(0.5)
                        .build();

                OpenAiResponse response = webClient.post()
                        .uri("https://api.openai.com/v1/chat/completions")
                        .header("Authorization", "Bearer " + apiKey)
                        .bodyValue(aiRequest)
                        .retrieve()
                        .bodyToMono(OpenAiResponse.class)
                        .block();

                if (response != null && !response.getChoices().isEmpty()) {
                    String content = response.getChoices().get(0).getMessage().getContent();
                    try {
                        JsonNode node = objectMapper.readTree(content);
                        successScore = node.has("score_succes") ? node.get("score_succes").asLong() : 50.0f;
                        riskScore = node.has("score_risque") ? node.get("score_risque").asLong() : 30.0f;
                        rawAnalysis = node.has("analyse") ? node.get("analyse").asText() : content;
                    } catch (Exception pe) {
                        log.warn("Failed to parse AI JSON response, using raw content: {}", pe.getMessage());
                        rawAnalysis = content;
                    }
                }
            } catch (Exception e) {
                log.error("Erreur lors de l'appel OpenAI: {}", e.getMessage());
                rawAnalysis += " (Erreur technique: " + e.getMessage() + ")";
            }
        } else {
            log.warn("Clé API OpenAI non configurée. Utilisation du mode dégradé.");
            rawAnalysis = "Mode démo (Clé API manquante) : Projet prometteur nécessitant plus de détails.";
        }

        // --- UPDATE OR CREATE LOGIC ---
        AnalyseIA analyse = analyseIARepository.findByProjet(projet)
                .orElse(new AnalyseIA());
        
        analyse.setProjet(projet);
        analyse.setScoreSucces(successScore);
        analyse.setScoreRisque(riskScore);
        analyse.setAnalyse(rawAnalysis);

        return analyseIAMapper.toResponseDTO(analyseIARepository.save(analyse));
    }

    @Override
    public String chatWithAI(String message, Long projetId) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("your_")) {
            return "Désolé, le chatbot IA est actuellement en maintenance (clé API non configurée).";
        }

        String contextPrompt = "Tu es l'assistant de bord de la plateforme de crowdfunding. ";
        if (projetId != null) {
            Projet projet = projetRepository.findById(projetId).orElse(null);
            if (projet != null) {
                contextPrompt += String.format("L'utilisateur pose une question sur le projet '%s' (%s). Réponds de manière utile et encourageante en restant neutre et objectif.", 
                    projet.getTitre(), projet.getDescription());
            }
        } else {
            contextPrompt += "Réponds aux questions des utilisateurs sur le crowdfunding, les investissements ou la création de projets sur notre plateforme.";
        }

        try {
            OpenAiRequest aiRequest = OpenAiRequest.builder()
                    .model(model)
                    .messages(List.of(
                        new OpenAiRequest.Message("system", contextPrompt),
                        new OpenAiRequest.Message("user", message)
                    ))
                    .temperature(0.7)
                    .build();

            OpenAiResponse response = webClient.post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(aiRequest)
                    .retrieve()
                    .bodyToMono(OpenAiResponse.class)
                    .block();

            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            log.error("Erreur Chatbot AI: {}", e.getMessage());
        }

        return "Désolé, je rencontre une petite difficulté technique pour vous répondre. Réessayez dans quelques instants.";
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
