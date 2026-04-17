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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
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

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

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
                "Agis en tant qu'expert en crowdfunding et analyste financier senior. Analyse de manière critique le projet suivant :\n"
                        +
                        "Titre: %s\n" +
                        "Description: %s\n" +
                        "Objectif Financier: %s %s\n" +
                        "Type: %s\n\n" +
                        "Répond EXCLUSIVEMENT sous forme d'un objet JSON plat. Ne mets aucun texte avant ou après le JSON. Voici le format attendu :\n"
                        +
                        "{\n" +
                        "  \"score_succes\": (nombre entre 0 et 100),\n" +
                        "  \"score_risque\": (nombre entre 0 et 100),\n" +
                        "  \"analyse\": \"(Analyse détaillée structurée avec SWOT : Forces, Faiblesses, Opportunités, Menaces)\"\n"
                        +
                        "}",
                projet.getTitre(), projet.getDescription(), projet.getObjectifFinancier(), "FCFA",
                projet.getTypeFinancement());

        String rawAnalysis = "Impossible de contacter l'IA Gemini pour le moment.";
        float successScore = 50.0f;
        float riskScore = 30.0f;

        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty() && !geminiApiKey.startsWith("your_")) {
            try {
                // Structure de requête pour Gemini
                Map<String, Object> geminiRequest = Map.of(
                        "contents", List.of(
                                Map.of("parts", List.of(Map.of("text", prompt)))),
                        "generationConfig", Map.of(
                                "temperature", 0.3,
                                "topP", 0.8,
                                "topK", 10));

                String url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key="
                    + geminiApiKey;

                JsonNode responseNode = webClient.post()
                        .uri(url)
                        .bodyValue(geminiRequest)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .timeout(java.time.Duration.ofSeconds(30))
                        .block();

                if (responseNode != null && responseNode.has("candidates")) {
                    String content = responseNode.get("candidates").get(0).get("content").get("parts").get(0)
                            .get("text").asText();
                    try {
                        String cleanedContent = extractJsonFromResponse(content);
                        JsonNode node = objectMapper.readTree(cleanedContent);
                        successScore = node.has("score_succes") ? node.get("score_succes").floatValue() : 50.0f;
                        riskScore = node.has("score_risque") ? node.get("score_risque").floatValue() : 30.0f;
                        rawAnalysis = node.has("analyse") ? node.get("analyse").asText() : content;
                    } catch (Exception pe) {
                        log.warn("Failed to parse Gemini JSON response, using raw content: {}", pe.getMessage());
                        rawAnalysis = content;
                    }
                }
            } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
                log.error("Erreur Gemini ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
                rawAnalysis = "Erreur Gemini : " + e.getResponseBodyAsString();
            } catch (Exception e) {
                log.error("Erreur lors de l'appel Gemini: {}", e.getMessage(), e);
                rawAnalysis += " (Erreur technique: " + e.getMessage() + ")";
            }
        } else {
            log.warn("Clé API Gemini non configurée. Utilisation du mode dégradé.");
            rawAnalysis = "Mode démo (Clé API Gemini manquante) : Projet prometteur.";
        }

        AnalyseIA analyse = analyseIARepository.findByProjet(projet)
                .orElse(new AnalyseIA());

        analyse.setProjet(projet);
        analyse.setScoreSucces(successScore);
        analyse.setScoreRisque(riskScore);
        analyse.setAnalyse(rawAnalysis);

        return analyseIAMapper.toResponseDTO(analyseIARepository.save(analyse));
    }

    private String extractJsonFromResponse(String response) {
        if (response.contains("```json")) {
            int start = response.indexOf("```json") + 7;
            int end = response.lastIndexOf("```");
            if (end > start) {
                return response.substring(start, end).trim();
            }
        } else if (response.contains("```")) {
            int start = response.indexOf("```") + 3;
            int end = response.lastIndexOf("```");
            if (end > start) {
                return response.substring(start, end).trim();
            }
        }
        return response.trim();
    }

    @Override
    public String chatWithAI(String message, Long projetId, java.util.List<java.util.Map<String, String>> history) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.startsWith("your_")) {
            return "Désolé, le chatbot IA (Gemini) est actuellement en maintenance (clé API non configurée).";
        }

        StringBuilder contextPrompt = new StringBuilder(
                "Tu es l'assistant de bord de la plateforme de crowdfunding InvestAFRIKA. ");
        if (projetId != null) {
            Projet projet = projetRepository.findById(projetId).orElse(null);
            if (projet != null) {
                contextPrompt.append(String.format(
                        "L'utilisateur pose une question sur le projet '%s' (%s). Réponds de manière utile et encourageante.",
                        projet.getTitre(), projet.getDescription()));
            }
        } else {
            contextPrompt.append(
                    "Réponds aux questions sur le crowdfunding, les investissements ou la création de projets.");
        }

        try {
            // Construction de l'historique pour Gemini
            java.util.List<java.util.Map<String, Object>> contents = new java.util.ArrayList<>();

            // Premier tour pour fixer le système
            java.util.Map<String, Object> systemInput = new java.util.HashMap<>();
            systemInput.put("role", "user");
            systemInput.put("parts",
                    java.util.List.of(java.util.Collections.singletonMap("text", contextPrompt.toString())));
            contents.add(systemInput);

            java.util.Map<String, Object> systemOutput = new java.util.HashMap<>();
            systemOutput.put("role", "model");
            systemOutput.put("parts", java.util.List
                    .of(java.util.Collections.singletonMap("text", "Bien reçu ! Je suis prêt à vous assister.")));
            contents.add(systemOutput);

            if (history != null && !history.isEmpty()) {
                int start = java.lang.Math.max(0, history.size() - 6);
                for (int i = start; i < history.size(); i++) {
                    java.util.Map<String, String> msg = history.get(i);
                    if (msg != null && msg.get("role") != null && msg.get("content") != null) {
                        java.util.Map<String, Object> turn = new java.util.HashMap<>();
                        String geminiRole = "assistant".equals(msg.get("role")) ? "model" : "user";
                        turn.put("role", geminiRole);
                        turn.put("parts",
                                java.util.List.of(java.util.Collections.singletonMap("text", msg.get("content"))));
                        contents.add(turn);
                    }
                }
            }

            java.util.Map<String, Object> userInput = new java.util.HashMap<>();
            userInput.put("role", "user");
            userInput.put("parts", java.util.List.of(java.util.Collections.singletonMap("text", message)));
            contents.add(userInput);

            java.util.Map<String, Object> geminiRequest = new java.util.HashMap<>();
            geminiRequest.put("contents", contents);

            java.util.Map<String, Object> generationConfig = new java.util.HashMap<>();
            generationConfig.put("temperature", 0.7);
            geminiRequest.put("generationConfig", generationConfig);

                    String url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key="
                        + geminiApiKey;

            JsonNode responseNode = webClient.post()
                    .uri(url)
                    .bodyValue(geminiRequest)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (responseNode != null && responseNode.has("candidates")) {
                return responseNode.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
            }
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("Erreur Gemini ({}): {}", e.getStatusCode(), errorBody);
            return "Désolé, Gemini a répondu avec une erreur : " + errorBody;
        } catch (Exception e) {
            log.error("Erreur Chatbot Gemini: {}", e.getMessage(), e);
            return "Désolé, je rencontre une difficulté technique avec Gemini (" + e.getClass().getSimpleName() + ").";
        }

        return "Gemini n'a pas pu générer de réponse. Veuillez réessayer.";
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
