package com.example.project.service.impl;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import com.example.project.entity.Contribution;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.ContribStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.ContributionMapper;
import com.example.project.repository.ContributionRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.ContributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link ContributionService}.
 * Manages the persistence of user contributions and provides aggregated data for projects.
 */
@Service
@RequiredArgsConstructor
public class ContributionServiceImpl implements ContributionService {

        private final ContributionRepository contributionRepository;
        private final ProjetRepository projetRepository;
        private final UtilisateurRepository utilisateurRepository;
        private final ContributionMapper contributionMapper;

        @Override
        @Transactional
        public ContributionResponseDTO createContribution(ContributionRequestDTO request) {
                Projet projet = projetRepository.findById(request.getProjetId())
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

                Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur",
                                                request.getUtilisateurId()));

                if (projet.getPorteur().getId().equals(utilisateur.getId())) {
                        throw new BadRequestException("Vous ne pouvez pas contribuer à votre propre projet");
                }

                Contribution contribution = contributionMapper.toEntity(request);
                contribution.setProjet(projet);
                contribution.setUtilisateur(utilisateur);
                contribution.setStatus(ContribStatus.PENDING); // Initial status

                return contributionMapper.toResponseDTO(contributionRepository.save(contribution));
        }

        @Override
        public ContributionResponseDTO getContribution(Long id) {
                Contribution contribution = contributionRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Contribution", id));
                return contributionMapper.toResponseDTO(contribution);
        }

        @Override
        public List<ContributionResponseDTO> getContributionsByProjet(Long projetId) {
                Projet projet = projetRepository.findById(projetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
                return contributionRepository.findByProjet(projet).stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ContributionResponseDTO> getContributionsByUtilisateur(Long utilisateurId) {
                Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));
                return contributionRepository.findByUtilisateur(utilisateur).stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ContributionResponseDTO> getAllContributions() {
                return contributionRepository.findAll().stream()
                                .map(contributionMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public BigDecimal getTotalAmountForProjet(Long projetId) {
                Projet projet = projetRepository.findById(projetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
                BigDecimal total = contributionRepository.sumAmountByProjet(projet);
                return total != null ? total : BigDecimal.ZERO;
        }
}
