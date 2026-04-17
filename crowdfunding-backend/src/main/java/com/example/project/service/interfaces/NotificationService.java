
package com.example.project.service.interfaces;

import com.example.project.dto.NotificationRequestDTO;
import com.example.project.dto.NotificationResponseDTO;
import java.util.List;

/**
 * Service interface for managing user notifications.
 * Handles alerting users about project updates, contributions, and system messages.
 */
public interface NotificationService {
    /**
     * Dispatches a new notification to a user.
     *
     * @param request the notification details.
     * @return the sent notification.
     */
    NotificationResponseDTO createNotification(NotificationRequestDTO request);

    /**
     * Retrieves all notifications for a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of notifications.
     */
    List<NotificationResponseDTO> getNotificationsByUser(Long utilisateurId);

    /**
     * Marks a notification as having been read by the user.
     *
     * @param id the notification ID.
     */
    void markAsRead(Long id);

    /**
     * Supprime une notification par son identifiant.
     * @param id l'identifiant de la notification
     */
    void deleteNotification(Long id);
}
