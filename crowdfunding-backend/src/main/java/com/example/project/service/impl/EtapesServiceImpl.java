package com.example.project.service.impl;

import com.example.project.dto.EtapesRequestDTO;
import com.example.project.dto.EtapesResponseDTO;
import com.example.project.entity.Etapes;
import com.example.project.entity.Projet;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.EtapesMapper;
import com.example.project.repository.EtapesRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.service.interfaces.EtapesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link EtapesService}.
 * Manages project lifecycle stages, including progress percentage updates and
 * completion status.
 */
@Service
@RequiredArgsConstructor
public class EtapesServiceImpl implements EtapesService {

    private final EtapesRepository etapesRepository;
    private final ProjetRepository projetRepository;
    private final EtapesMapper etapesMapper;

    @Override
    @Transactional
    public EtapesResponseDTO createEtape(EtapesRequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        Etapes etape = etapesMapper.toEntity(request);
        etape.setProjet(projet);

        if (etape.getProgress() == null)
            etape.setProgress(0);
        if (etape.getEstTermine() == null)
            etape.setEstTermine(false);

        return etapesMapper.toResponseDTO(etapesRepository.save(etape));
    }

    @Override
    public EtapesResponseDTO getEtape(Long id) {
        Etapes etape = etapesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etape", id));
        return etapesMapper.toResponseDTO(etape);
    }

    @Override
    @Transactional
    public EtapesResponseDTO updateEtape(Long id, EtapesRequestDTO request) {
        Etapes etape = etapesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etape", id));

        etape.setTitre(request.getTitre());
        etape.setDescription(request.getDescription());

        if (request.getProgress() != null) {
            etape.setProgress(request.getProgress());
        }

        if (request.getEstTermine() != null) {
            etape.setEstTermine(request.getEstTermine());
            if (request.getEstTermine()) {
                etape.setProgress(100);
            }
        }

        return etapesMapper.toResponseDTO(etapesRepository.save(etape));
    }

    @Override
    @Transactional
    public void deleteEtape(Long id) {
        if (!etapesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Etape", id);
        }
        etapesRepository.deleteById(id);
    }

    @Override
    public List<EtapesResponseDTO> getEtapesByProjet(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        return etapesRepository.findByProjet(projet).stream()
                .map(EtapesMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
