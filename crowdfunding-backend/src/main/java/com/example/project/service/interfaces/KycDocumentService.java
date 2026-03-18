package com.example.project.service.interfaces; // syntax fix

import com.example.project.dto.KycDocumentRequestDTO;
import com.example.project.dto.KycDocumentResponseDTO;
import com.example.project.enums.StatutDocument;
import com.example.project.enums.TypeDocument;

import java.util.List;

/**
 * Service interface for KYC (Know Your Customer) document management.
 * Handles identity document uploads and verification workflows.
 */
public interface KycDocumentService {
    /**
     * Uploads a new identity document for verification.
     *
     * @param request the document details.
     * @return the record of the uploaded document.
     */
    KycDocumentResponseDTO uploadDocument(KycDocumentRequestDTO request);

    /**
     * Retrieves a specific KYC document.
     *
     * @param id the document ID.
     * @return the document details.
     */
    KycDocumentResponseDTO getDocument(Long id);

    /**
     * Lists all KYC documents for a specific user.
     *
     * @param utilisateurId the user ID.
     * @return a list of documents.
     */
    List<KycDocumentResponseDTO> getDocumentsByUser(Long utilisateurId);

    /**
     * Updates the verification status of a document (Approve/Reject).
     *
     * @param documentId the document ID.
     * @param status the new status.
     * @param reason the reason for the decision (especially for rejections).
     */
    void updateDocumentStatus(Long documentId, StatutDocument status, String reason);
}
