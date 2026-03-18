package com.example.project.controller;

import com.example.project.service.interfaces.NotificationService;
import com.example.project.dto.NotificationRequestDTO;
import com.example.project.dto.NotificationResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for system notifications.
 * Handles the distribution and reading of alerts and updates to users.
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Système d'alertes et de notifications aux utilisateurs")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Sends a new notification to a specific user (Admin only).
     *
     * @param request the notification details.
     * @return the created notification.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer une notification", description = "Envoie une nouvelle notification à un utilisateur (Admin uniquement).")
    @ApiResponse(responseCode = "201", description = "Notification envoyée avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @Valid @RequestBody NotificationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    /**
     * Lists all notifications for a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of notifications.
     */
    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Lister les notifications d'un utilisateur", description = "Affiche toutes les notifications reçues par un utilisateur spécifique.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUser(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(utilisateurId));
    }

    /**
     * Marks a specific notification as read.
     *
     * @param id the notification ID.
     * @return a success response.
     */
    @PatchMapping("/{id}/read")
    @Operation(summary = "Marquer comme lue", description = "Définit le statut d'une notification comme 'lue'.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
