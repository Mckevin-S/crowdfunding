package com.example.project.controller;

import com.example.project.dto.LitigeRequestDTO;
import com.example.project.dto.LitigeResolutionDTO;
import com.example.project.dto.LitigeResponseDTO;
import com.example.project.service.interfaces.LitigeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/litiges")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Litiges", description = "Gestion des conflits et signalements")
public class LitigeController {

    private final LitigeService litigeService;

    @PostMapping
    @Operation(summary = "Ouvrir un litige", description = "Permet à un utilisateur de signaler un problème lié à la plateforme ou à un projet.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<LitigeResponseDTO> createLitige(@Valid @RequestBody LitigeRequestDTO request) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        // Dans une implémentation complète, on récupérerait l'ID exact depuis securityContext
        // Ici on suppose que le service peut le gérer
        // Pour simplifier l'exemple, on autorise l'envoi de plaignantId dans une vraie architecture (via header user)
        log.info("LITIGE: Ouverture d'un litige pour {}", currentUserEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(litigeService.createLitige(request, 1L)); // 1L est placeholder si auth ne donne pas d'ID
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister les litiges", description = "Récupère la liste globale de tous les litiges (Admin).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<LitigeResponseDTO>> getAllLitiges() {
        return ResponseEntity.ok(litigeService.getAllLitiges());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtenir un litige détaillé", description = "L'admin consulte les preuves ou détails d'un litige.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<LitigeResponseDTO> getLitigeById(@PathVariable Long id) {
        return ResponseEntity.ok(litigeService.getLitigeById(id));
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Résoudre un litige", description = "Applique une résolution administrative et clôt le litige.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<LitigeResponseDTO> resolveLitige(
            @PathVariable Long id,
            @Valid @RequestBody LitigeResolutionDTO resolution) {
        log.info("LITIGE_RESOLU: {} avec statut {}", id, resolution.getStatut());
        return ResponseEntity.ok(litigeService.resolveLitige(id, resolution));
    }
}
