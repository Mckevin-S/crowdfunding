package com.example.project.service.impl;

import com.example.project.dto.LitigeRequestDTO;
import com.example.project.dto.LitigeResolutionDTO;
import com.example.project.dto.LitigeResponseDTO;
import com.example.project.entity.Litige;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.StatutLitige;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.repository.LitigeRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.AuditLogService;
import com.example.project.service.interfaces.LitigeService;
import com.example.project.service.interfaces.NotificationService;
import com.example.project.dto.NotificationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LitigeServiceImpl implements LitigeService {

    private final LitigeRepository litigeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProjetRepository projetRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public LitigeResponseDTO createLitige(LitigeRequestDTO request, Long plaignantId) {
        Utilisateur plaignant = utilisateurRepository.findById(plaignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", plaignantId));

        Litige litige = Litige.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .type(request.getType())
                .statut(StatutLitige.NOUVEAU)
                .plaignant(plaignant)
                .build();

        if (request.getAccuseId() != null) {
            Utilisateur accuse = utilisateurRepository.findById(request.getAccuseId()).orElse(null);
            litige.setAccuse(accuse);
        }

        if (request.getProjetConcerneId() != null) {
            Projet projet = projetRepository.findById(request.getProjetConcerneId()).orElse(null);
            litige.setProjetConcerne(projet);
        }

        Litige savedLitige = litigeRepository.save(litige);
        
        // --- NOTIFICATION ---
        try {
            if (savedLitige.getAccuse() != null) {
                String msg = "Alerte : Un litige (" + savedLitige.getType() + ") a été ouvert contre vous par " + plaignant.getPrenom() + " " + plaignant.getNom();
                notificationService.createNotification(new NotificationRequestDTO(
                    savedLitige.getAccuse().getId(),
                    msg,
                    true // Critical
                ));
            }
        } catch (Exception e) {
            // Log
        }
 
        return mapToDto(savedLitige);
    }

    @Override
    public List<LitigeResponseDTO> getAllLitiges() {
        return litigeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LitigeResponseDTO getLitigeById(Long id) {
        Litige litige = litigeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Litige", id));
        return mapToDto(litige);
    }

    @Override
    @Transactional
    public LitigeResponseDTO resolveLitige(Long id, LitigeResolutionDTO resolution) {
        Litige litige = litigeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Litige", id));

        litige.setStatut(resolution.getStatut());
        litige.setDecisionAdmin(resolution.getDecisionAdmin());
        
        if (resolution.getStatut() == StatutLitige.RESOLU || resolution.getStatut() == StatutLitige.REJETE) {
            litige.setDateResolution(LocalDateTime.now());
        } else {
            litige.setDateResolution(null); // Si on le remet en cours
        }

        Litige saved = litigeRepository.save(litige);

        // Audit Trail
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Utilisateur admin = utilisateurRepository.findByEmail(currentUserEmail).orElse(null);
            if (admin != null) {
                auditLogService.logAction(
                        admin.getId(),
                        "LITIGE_RESOLUTION",
                        null,
                        "Litige ID: " + id + ", Nouveau statut: " + resolution.getStatut()
                );
            }
        } catch (Exception ignored) {}

        // --- NOTIFICATIONS ---
        try {
            String msg = "Résolution de litige : Le litige #" + id + " (" + saved.getTitre() + ") a été marqué comme " + resolution.getStatut() + ". Décision : " + resolution.getDecisionAdmin();

            // Notify Plaignant
            notificationService.createNotification(new NotificationRequestDTO(saved.getPlaignant().getId(), msg, true));

            // Notify Accuse
            if (saved.getAccuse() != null) {
                notificationService.createNotification(new NotificationRequestDTO(saved.getAccuse().getId(), msg, true));
            }
        } catch (Exception e) {
            // Log
        }

        return mapToDto(saved);
    }

    private LitigeResponseDTO mapToDto(Litige litige) {
        return LitigeResponseDTO.builder()
                .id(litige.getId())
                .titre(litige.getTitre())
                .description(litige.getDescription())
                .statut(litige.getStatut())
                .type(litige.getType())
                .plaignantId(litige.getPlaignant().getId())
                .plaignantNom(litige.getPlaignant().getPrenom() + " " + litige.getPlaignant().getNom())
                .accuseId(litige.getAccuse() != null ? litige.getAccuse().getId() : null)
                .accuseNom(litige.getAccuse() != null ? litige.getAccuse().getPrenom() + " " + litige.getAccuse().getNom() : null)
                .projetConcerneId(litige.getProjetConcerne() != null ? litige.getProjetConcerne().getId() : null)
                .projetConcerneTitre(litige.getProjetConcerne() != null ? litige.getProjetConcerne().getTitre() : null)
                .decisionAdmin(litige.getDecisionAdmin())
                .dateCreation(litige.getDateCreation())
                .dateResolution(litige.getDateResolution())
                .build();
    }
}
