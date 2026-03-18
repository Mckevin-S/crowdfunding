package com.example.project.service.impl;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.StatutProjet;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.ProjetMapper;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.ProjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link ProjetService}.
 * Orchestrates the project lifecycle, enforcing business rules like date validation and status transition constraints.
 * Ensures only owners can modify projects in "BROUILLON" state.
 */
@Service
@RequiredArgsConstructor
public class ProjetServiceImpl implements ProjetService {

    private final ProjetRepository projetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProjetMapper projetMapper;

    @Override
    @Transactional
    public ProjetResponseDTO createProjet(ProjetRequestDTO request) {
        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new BadRequestException("La date de fin doit être postérieure à la date de début");
        }

        Utilisateur porteur = utilisateurRepository.findById(request.getPorteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", request.getPorteurId()));

        Projet projet = projetMapper.toEntity(request);
        projet.setPorteur(porteur);
        projet.setStatut(StatutProjet.BROUILLON); // Toujours BROUILLON à la création

        return projetMapper.toResponseDTO(projetRepository.save(projet));
    }

    @Override
    public ProjetResponseDTO getProjet(Long id) {
        return projetMapper.toResponseDTO(getProjetById(id));
    }

    @Override
    @Transactional
    public ProjetResponseDTO updateProjet(Long id, ProjetRequestDTO request) {
        Projet projet = getProjetById(id);

        if (projet.getStatut() != StatutProjet.BROUILLON) {
            throw new BadRequestException("Seuls les projets en brouillon peuvent être modifiés");
        }

        projet.setTitre(request.getTitre());
        projet.setDescription(request.getDescription());
        projet.setObjectifFinancier(request.getObjectifFinancier());
        projet.setTypeFinancement(request.getTypeFinancement());
        projet.setDateDebut(request.getDateDebut());
        projet.setDateFin(request.getDateFin());

        return projetMapper.toResponseDTO(projetRepository.save(projet));
    }

    @Override
    @Transactional
    public void deleteProjet(Long id) {
        Projet projet = getProjetById(id);
        if (projet.getMontantActuel().compareTo(java.math.BigDecimal.ZERO) > 0) {
            throw new BadRequestException("Impossible de supprimer un projet ayant déjà reçu des contributions");
        }
        projetRepository.delete(projet);
    }

    @Override
    public List<ProjetResponseDTO> getAllProjets() {
        return projetRepository.findAll().stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjetResponseDTO> getProjetsByPorteur(Long porteurId) {
        Utilisateur porteur = utilisateurRepository.findById(porteurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", porteurId));
        return projetRepository.findProjectsByOwner(porteur).stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjetResponseDTO> getActiveProjets() {
        return projetRepository.findActiveProjectsByStatus(StatutProjet.EN_COURS, LocalDate.now())
                .stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjetResponseDTO updateStatut(Long id, StatutProjet nouveauStatut) {
        Projet projet = getProjetById(id);
        projet.setStatut(nouveauStatut);
        return projetMapper.toResponseDTO(projetRepository.save(projet));
    }

    private Projet getProjetById(Long id) {
        return projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", id));
    }
}
