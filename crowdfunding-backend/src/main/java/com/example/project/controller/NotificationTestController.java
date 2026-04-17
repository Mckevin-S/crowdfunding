package com.example.project.controller;

import com.example.project.dto.NotificationRequestDTO;
import com.example.project.dto.NotificationResponseDTO;
import com.example.project.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test-notifications")
@RequiredArgsConstructor
public class NotificationTestController {

    private final NotificationService notificationService;

    @GetMapping("/send")
    public ResponseEntity<NotificationResponseDTO> sendTest(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(defaultValue = "INFO") String category) {
        
        NotificationRequestDTO request = new NotificationRequestDTO(
            userId,
            "🚀 Test réussi ! WebSocket et Email fonctionnels à " + java.time.LocalTime.now(),
            category,
            true // On active l'envoi d'email
        );

        return ResponseEntity.ok(notificationService.createNotification(request));
    }
}
