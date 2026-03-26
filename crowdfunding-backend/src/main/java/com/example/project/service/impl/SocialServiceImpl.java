package com.example.project.service.impl;

import com.example.project.dto.*;
import com.example.project.entity.Comment;
import com.example.project.entity.Interaction;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.InteractionType;
import com.example.project.repository.CommentRepository;
import com.example.project.repository.InteractionRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.NotificationService;
import com.example.project.service.interfaces.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialServiceImpl implements SocialService {

    private final CommentRepository commentRepository;
    private final InteractionRepository interactionRepository;
    private final ProjetRepository projetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CommentResponseDTO addComment(CommentRequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Comment comment = new Comment();
        comment.setProjet(projet);
        comment.setUtilisateur(utilisateur);
        comment.setContenu(request.getContenu());

        Comment saved = commentRepository.save(comment);

        // Envoyer une notification au porteur
        if (!projet.getPorteur().getId().equals(utilisateur.getId())) {
            notificationService.createNotification(new NotificationRequestDTO(
                    projet.getPorteur().getId(),
                    utilisateur.getPrenom() + " a commenté votre projet : " + projet.getTitre(),
                    false
            ));
        }

        return mapToCommentResponse(saved);
    }

    @Override
    public List<CommentResponseDTO> getCommentsByProject(Long projectId) {
        return commentRepository.findByProjetIdOrderByDateCreationDesc(projectId)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    @Transactional
    public InteractionResponseDTO toggleLike(Long projetId, Long utilisateurId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return interactionRepository.findByUtilisateurIdAndProjetIdAndType(utilisateurId, projetId, InteractionType.LIKE)
                .map(existing -> {
                    interactionRepository.delete(existing);
                    return mapToInteractionResponse(existing); // This return doesn't strictly matter for a toggle, but matches signature
                })
                .orElseGet(() -> {
                    Interaction like = new Interaction();
                    like.setProjet(projet);
                    like.setUtilisateur(utilisateur);
                    like.setType(InteractionType.LIKE);
                    Interaction saved = interactionRepository.save(like);

                    // Envoyer notification au porteur
                    if (!projet.getPorteur().getId().equals(utilisateur.getId())) {
                        notificationService.createNotification(new NotificationRequestDTO(
                                projet.getPorteur().getId(),
                                utilisateur.getPrenom() + " a aimé votre projet : " + projet.getTitre(),
                                false
                        ));
                    }
                    return mapToInteractionResponse(saved);
                });
    }

    @Override
    @Transactional
    public void trackShare(Long projetId, Long utilisateurId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Interaction share = new Interaction();
        share.setProjet(projet);
        share.setUtilisateur(utilisateur);
        share.setType(InteractionType.SHARE);
        interactionRepository.save(share);

        // Notification de partage
        if (!projet.getPorteur().getId().equals(utilisateur.getId())) {
            notificationService.createNotification(new NotificationRequestDTO(
                    projet.getPorteur().getId(),
                    utilisateur.getPrenom() + " a partagé votre projet : " + projet.getTitre(),
                    false
            ));
        }
    }

    @Override
    public SocialStatsDTO getProjectSocialStats(Long projetId, Long utilisateurId) {
        long likes = interactionRepository.countByProjetIdAndType(projetId, InteractionType.LIKE);
        long shares = interactionRepository.countByProjetIdAndType(projetId, InteractionType.SHARE);
        long comments = commentRepository.findByProjetIdOrderByDateCreationDesc(projetId).size();
        
        boolean isLiked = false;
        if (utilisateurId != null) {
            isLiked = interactionRepository.findByUtilisateurIdAndProjetIdAndType(utilisateurId, projetId, InteractionType.LIKE).isPresent();
        }

        return SocialStatsDTO.builder()
                .likesCount(likes)
                .sharesCount(shares)
                .commentsCount(comments)
                .isLikedByCurrentUser(isLiked)
                .build();
    }

    private CommentResponseDTO mapToCommentResponse(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setProjetId(comment.getProjet().getId());
        dto.setUtilisateurId(comment.getUtilisateur().getId());
        dto.setUtilisateurNom(comment.getUtilisateur().getPrenom() + " " + comment.getUtilisateur().getNom());
        dto.setContenu(comment.getContenu());
        dto.setDateCreation(comment.getDateCreation());
        return dto;
    }

    private InteractionResponseDTO mapToInteractionResponse(Interaction interaction) {
        InteractionResponseDTO dto = new InteractionResponseDTO();
        dto.setId(interaction.getId());
        dto.setProjetId(interaction.getProjet().getId());
        dto.setUtilisateurId(interaction.getUtilisateur().getId());
        dto.setType(interaction.getType());
        dto.setDateCreation(interaction.getDateCreation());
        return dto;
    }
}
