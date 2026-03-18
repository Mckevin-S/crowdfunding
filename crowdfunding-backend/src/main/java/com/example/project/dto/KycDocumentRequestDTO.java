package com.example.project.dto;

import com.example.project.enums.TypeDocument;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for uploading a KYC (Know Your Customer) document.
 * Essential for verifying user identity and allowing financial operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Demande de téléchargement d'un document KYC")
public class KycDocumentRequestDTO {

    @Schema(description = "ID de l'utilisateur concerné", example = "1")
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;

    @Schema(description = "Type de document (ID_CARD, PASSPORT, etc.)", example = "CNI")
    @NotNull(message = "Le type de document ne doit pas être nul")
    private TypeDocument typeDocument;

    @Schema(description = "URL pointant vers le fichier stocké", example = "https://storage.example.com/kyc/doc123.pdf")
    @NotNull(message = "L'URL du document ne doit pas être nulle")
    private String documentUrl;
}
