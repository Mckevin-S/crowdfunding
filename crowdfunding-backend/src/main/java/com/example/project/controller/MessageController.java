package com.example.project.controller;

import com.example.project.dto.MessageRequestDTO;
import com.example.project.dto.MessageResponseDTO;
import com.example.project.service.interfaces.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Gestion des messages entre utilisateurs")
@SecurityRequirement(name = "bearerAuth")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("@securityService.isCurrentUser(#request.expediteurId)")
    @Operation(summary = "Envoyer un message")
    public ResponseEntity<MessageResponseDTO> sendMessage(@Valid @RequestBody MessageRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messageService.sendMessage(request));
    }

    @GetMapping("/conversation")
    @PreAuthorize("@securityService.isCurrentUser(#user1Id) or @securityService.isCurrentUser(#user2Id)")
    @Operation(summary = "Récupérer une conversation entre deux utilisateurs")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id) {
        return ResponseEntity.ok(messageService.getConversation(user1Id, user2Id));
    }

    @GetMapping("/recent/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId)")
    @Operation(summary = "Récupérer les conversations récentes d'un utilisateur")
    public ResponseEntity<List<MessageResponseDTO>> getRecentConversations(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getRecentConversations(userId));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Marquer un message comme lu")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @RequestParam Long userId) {
        messageService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId)")
    @Operation(summary = "Nombre de messages non lus")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUnreadCount(userId));
    }
}
