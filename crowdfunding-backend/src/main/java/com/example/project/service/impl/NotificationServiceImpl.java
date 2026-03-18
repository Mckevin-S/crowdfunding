package com.example.project.service.impl;

import com.example.project.dto.NotificationRequestDTO;
import com.example.project.dto.NotificationResponseDTO;
import com.example.project.entity.Notification;
import com.example.project.entity.Utilisateur;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.NotificationMapper;
import com.example.project.repository.NotificationRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.EmailService;
import com.example.project.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link NotificationService}.
 * Dispatches in-app notifications and triggers corresponding email alerts via {@link EmailService}.
 */
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public NotificationResponseDTO createNotification(NotificationRequestDTO request) {
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", request.getUtilisateurId()));

        Notification notification = notificationMapper.toEntity(request);
        notification.setUtilisateur(utilisateur);
        notification.setEstLu(false);

        notification = notificationRepository.save(notification);

        // Send email in background asynchronously ideally, here synchronous for
        // simplicity
        emailService.sendSimpleMessage(utilisateur.getEmail(), "Nouvelle notification", request.getMessage());

        return notificationMapper.toResponseDTO(notification);
    }

    @Override
    public List<NotificationResponseDTO> getNotificationsByUser(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        return notificationRepository.findByUtilisateur(utilisateur).stream()
                .map(notificationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        notification.setEstLu(true);
        notificationRepository.save(notification);
    }
}
