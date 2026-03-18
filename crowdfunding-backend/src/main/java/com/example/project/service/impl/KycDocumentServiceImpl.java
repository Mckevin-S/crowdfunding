package com.example.project.service.impl;

import com.example.project.dto.KycDocumentRequestDTO;
import com.example.project.dto.KycDocumentResponseDTO;
import com.example.project.entity.KycDocument;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.StatutDocument;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.KycDocumentMapper;
import com.example.project.repository.KycDocumentRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.KycDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link KycDocumentService}.
 * Handles the storage and administrative review of identity documents for user verification.
 */
@Service
@RequiredArgsConstructor
public class KycDocumentServiceImpl implements KycDocumentService {

    private final KycDocumentRepository kycDocumentRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final KycDocumentMapper kycDocumentMapper;

    @Override
    @Transactional
    public KycDocumentResponseDTO uploadDocument(KycDocumentRequestDTO request) {
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", request.getUtilisateurId()));

        KycDocument document = kycDocumentMapper.toEntity(request);
        document.setUtilisateur(utilisateur);
        document.setStatut(StatutDocument.EN_ATTENTE); // Initial state

        return kycDocumentMapper.toResponseDTO(kycDocumentRepository.save(document));
    }

    @Override
    public KycDocumentResponseDTO getDocument(Long id) {
        KycDocument document = kycDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document KYC", id));
        return kycDocumentMapper.toResponseDTO(document);
    }

    @Override
    public List<KycDocumentResponseDTO> getDocumentsByUser(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        return kycDocumentRepository.findByUtilisateur(utilisateur).stream()
                .map(kycDocumentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateDocumentStatus(Long documentId, StatutDocument status, String reason) {
        KycDocument document = kycDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document KYC", documentId));

        document.setStatut(status);
        document.setRejectionReason(reason);

        kycDocumentRepository.save(document);
    }
}
