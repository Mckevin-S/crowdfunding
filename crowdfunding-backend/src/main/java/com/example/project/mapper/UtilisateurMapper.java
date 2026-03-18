package com.example.project.mapper;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import com.example.project.entity.Utilisateur;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UtilisateurMapper {

    Utilisateur toEntity(UtilisateurRequestDTO dto);

    UtilisateurResponseDTO toResponseDTO(Utilisateur entity);

    UtilisateurRequestDTO toRequestDTO(Utilisateur entity);
}
