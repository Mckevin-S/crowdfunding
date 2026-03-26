package com.example.project.service.interfaces;

import com.example.project.dto.LitigeRequestDTO;
import com.example.project.dto.LitigeResolutionDTO;
import com.example.project.dto.LitigeResponseDTO;

import java.util.List;

public interface LitigeService {
    LitigeResponseDTO createLitige(LitigeRequestDTO request, Long plaignantId);
    List<LitigeResponseDTO> getAllLitiges();
    LitigeResponseDTO getLitigeById(Long id);
    LitigeResponseDTO resolveLitige(Long id, LitigeResolutionDTO resolution);
}
