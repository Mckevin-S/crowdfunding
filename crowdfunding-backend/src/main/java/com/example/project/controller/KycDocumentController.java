package com.example.project.controller;

import com.example.project.dto.KycDocumentRequestDTO;
import com.example.project.dto.KycDocumentResponseDTO;
import com.example.project.enums.StatutDocument;
import com.example.project.service.interfaces.KycDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for KYC (Know Your Customer) document management.
 * Allows users to submit identity proofs and administrators to review them.
 */
@RestController
@RequestMapping("/api/v1/kyc-documents")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "KYC Documents", description = "Vérification d'identité et gestion des documents légaux")
public class KycDocumentController {

    private final KycDocumentService kycDocumentService;

    /**
     * Uploads a new document for identity verification.
     *
     * @param request the document details and URL.
     * @return the created document record.
     */
    @PostMapping
    @Operation(summary = "Soumettre un document", description = "Envoie un nouveau document pour vérification d'identité.")
    @ApiResponse(responseCode = "201", description = "Document soumis avec succès")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<KycDocumentResponseDTO> uploadDocument(@Valid @RequestBody KycDocumentRequestDTO request) {
        log.info("KYC_UPLOAD: Nouveau document soumis pour l'utilisateur ID: {}, Type: {}",
                request.getUtilisateurId(), request.getTypeDocument());
        return ResponseEntity.status(HttpStatus.CREATED).body(kycDocumentService.uploadDocument(request));
    }

    /**
     * Retrieves a specific document (Admin only).
     *
     * @param id the document ID.
     * @return the document details.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtenir un document", description = "Récupère les détails d'un document spécifique (Admin uniquement).")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<KycDocumentResponseDTO> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(kycDocumentService.getDocument(id));
    }

    /**
     * Lists all documents submitted by a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of documents for the user.
     */
    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    @Operation(summary = "Lister les documents d'un utilisateur", description = "Affiche tous les documents KYC fournis par un utilisateur.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<KycDocumentResponseDTO>> getDocumentsByUser(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(kycDocumentService.getDocumentsByUser(utilisateurId));
    }

    /**
     * Approves or rejects a KYC document (Admin only).
     *
     * @param id     the document ID.
     * @param status the new status.
     * @param reason the reason for rejection (if applicable).
     * @return a success response.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Valider/Rejeter un document", description = "Permet à un administrateur de changer le statut d'un document KYC.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> updateDocumentStatus(
            @PathVariable Long id,
            @RequestParam StatutDocument status,
            @RequestParam(required = false) String reason) {
        log.info("KYC_STATUS_UPDATE: Changement de statut du document ID: {} vers {}, Raison: {}",
                id, status, reason != null ? reason : "N/A");
        kycDocumentService.updateDocumentStatus(id, status, reason);
        return ResponseEntity.ok().build();
    }
}
