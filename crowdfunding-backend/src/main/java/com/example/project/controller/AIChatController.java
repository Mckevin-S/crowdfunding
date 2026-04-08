package com.example.project.controller;

import com.example.project.service.interfaces.AnalyseIAService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
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
        String response = analyseIAService.chatWithAI(request.getMessage(), request.getProjetId());
        return ResponseEntity.ok(Map.of("response", response));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRequest {
        private String message;
        private Long projetId;
    }
}
