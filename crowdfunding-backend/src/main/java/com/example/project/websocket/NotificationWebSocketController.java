package com.example.project.websocket;

import com.example.project.dto.NotificationResponseDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@lombok.extern.slf4j.Slf4j
public class NotificationWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotificationToUser(Long userId, NotificationResponseDTO notification) {
        String destination = "/topic/notifications/" + userId;
        log.info("[WS] Envoi d'une notification vers {} : {}", destination, notification.getMessage());
        messagingTemplate.convertAndSend(destination, notification);
    }
}

