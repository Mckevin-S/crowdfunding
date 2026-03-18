package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing a user's wallet.
 * Contains information about available funds and creation date.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant les détails du portefeuille")
public class WalletResponseDTO {
    
    @Schema(description = "Identifiant du portefeuille", example = "1")
    private Long id;
    
    @Schema(description = "ID du propriétaire", example = "1")
    private Long utilisateurId;
    
    @Schema(description = "Solde actuel disponible", example = "50000")
    private BigDecimal solde;
    
    @Schema(description = "Date de création du portefeuille", example = "2026-01-01T00:00:00")
    private LocalDateTime dateCreation;
}
