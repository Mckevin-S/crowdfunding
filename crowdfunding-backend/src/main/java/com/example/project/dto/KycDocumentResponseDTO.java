package com.example.project.dto;

import com.example.project.enums.StatutDocument;
import com.example.project.enums.TypeDocument;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for KYC document response data.
 * Includes the current verification status and timestamps.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails d'un document KYC")
public class KycDocumentResponseDTO {
    
    @Schema(description = "Identifiant du document", example = "1")
    private Long id;
    
    @Schema(description = "ID de l'utilisateur propriétaire", example = "1")
    private Long utilisateurId;
    
    @Schema(description = "Type de document", example = "CNI")
    private TypeDocument typeDocument;
    
    @Schema(description = "URL du document", example = "https://storage.example.com/...")
    private String documentUrl;
    
    @Schema(description = "Statut de validation", example = "EN_ATTENTE")
    private StatutDocument statut;
    
    @Schema(description = "Motif de rejet (si applicable)", example = "Photo floue")
    private String rejectionReason;
    
    @Schema(description = "Date et heure de soumission", example = "2026-03-17T12:00:00")
    private LocalDateTime dateSoumission;
}
