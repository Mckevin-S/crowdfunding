package com.example.project.service.impl;

import com.example.project.dto.MessageRequestDTO;
import com.example.project.dto.MessageResponseDTO;
import com.example.project.entity.Message;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.exception.UnauthorizedException;
import com.example.project.mapper.MessageMapper;
import com.example.project.repository.MessageRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.MessageService;
import com.example.project.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProjetRepository projetRepository;
    private final MessageMapper messageMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public MessageResponseDTO sendMessage(MessageRequestDTO request) {
        Utilisateur expediteur = utilisateurRepository.findById(request.getExpediteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Expéditeur", request.getExpediteurId()));
                
        Utilisateur destinataire = utilisateurRepository.findById(request.getDestinataireId())
                .orElseThrow(() -> new ResourceNotFoundException("Destinataire", request.getDestinataireId()));

        Message message = messageMapper.toEntity(request);
        message.setExpediteur(expediteur);
        message.setDestinataire(destinataire);

        if (request.getProjetId() != null) {
            Projet projet = projetRepository.findById(request.getProjetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));
            message.setProjet(projet);
        }

        Message savedMessage = messageRepository.save(message);

        // Envoyer une notification optionnelle via NotificationService
        try {
            // Un vrai service de notification pourrait checker si l'user est en ligne via WebSockets
            // Pour l'instant on garde le log structuré.
            log.info("Nouveau message de {} envoyé à {}", expediteur.getEmail(), destinataire.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de la notification silencieuse pour message.", e);
        }

        return messageMapper.toResponseDTO(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getConversation(Long user1Id, Long user2Id) {
        Utilisateur user1 = utilisateurRepository.findById(user1Id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", user1Id));
        Utilisateur user2 = utilisateurRepository.findById(user2Id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", user2Id));

        return messageRepository.findConversation(user1, user2).stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getRecentConversations(Long userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", userId));

        return messageRepository.findRecentConversationsByUser(user).stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", messageId));

        if (!message.getDestinataire().getId().equals(userId)) {
            throw new UnauthorizedException("Vous ne pouvez pas marquer comme lu un message qui ne vous est pas destiné.");
        }

        message.setLu(true);
        messageRepository.save(message);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", userId));
        return messageRepository.countByDestinataireAndLuFalse(user);
    }
}
