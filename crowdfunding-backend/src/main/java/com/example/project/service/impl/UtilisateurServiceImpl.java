package com.example.project.service.impl;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import com.example.project.entity.Utilisateur;
import com.example.project.enums.UserStatus;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.UtilisateurMapper;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link UtilisateurService}.
 * Handles user profile updates and administrative actions like account suspension (banning).
 */
@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UtilisateurResponseDTO getProfil(Long id) {
        Utilisateur user = getUtilisateurById(id);
        return UtilisateurMapper.INSTANCE.toResponseDTO(user);
    }

    @Override
    @Transactional
    public UtilisateurResponseDTO updateProfil(Long id, UtilisateurRequestDTO request) {
        Utilisateur user = getUtilisateurById(id);

        // Update user fields safely
        if (request.getPrenom() != null)
            user.setPrenom(request.getPrenom());
        if (request.getNom() != null)
            user.setNom(request.getNom());
        if (request.getTelephone() != null)
            user.setTelephone(request.getTelephone());
        if (request.getBio() != null)
            user.setBio(request.getBio());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());

        return UtilisateurMapper.INSTANCE.toResponseDTO(utilisateurRepository.save(user));
    }

    @Override
    public List<UtilisateurResponseDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(UtilisateurMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void banUtilisateur(Long id) {
        Utilisateur user = getUtilisateurById(id);
        user.setStatut(UserStatus.BANNED);
        utilisateurRepository.save(user);
    }

    @Override
    @Transactional
    public void activateUtilisateur(Long id) {
        Utilisateur user = getUtilisateurById(id);
        user.setStatut(UserStatus.ACTIVE);
        utilisateurRepository.save(user);
    }

    private Utilisateur getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
    }
}
