package com.example.project.controller;

import com.example.project.service.interfaces.AnalyseIAService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "AI Chat", description = "Chatbot interactif piloté par GPT-4")
public class AIChatController {

    private final AnalyseIAService analyseIAService;

    public AIChatController(AnalyseIAService analyseIAService) {
        this.analyseIAService = analyseIAService;
    }

    @PostMapping("/chat")
    @Operation(summary = "Discuter avec l'IA", description = "Envoie un message au chatbot et reçoit une réponse contextuelle.")
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequest request) {
        try {
            String response = analyseIAService.chatWithAI(request.getMessage(), request.getProjetId(),
                    request.getHistory());
            return ResponseEntity.ok(java.util.Collections.singletonMap("response", response != null ? response : "L'IA n'a pas répondu."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Collections.singletonMap("response", 
                "Désolé, une erreur interne est survenue : " + e.getMessage()));
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRequest {
        @Schema(description = "Message de l'utilisateur")
        private String message;

        @Schema(description = "ID du projet lié (optionnel)")
        private Long projetId;

        @Schema(description = "Historique récent de la conversation (optionnel)")
        private java.util.List<Map<String, String>> history;
    }
}
