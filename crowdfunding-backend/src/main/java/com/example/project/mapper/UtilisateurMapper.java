package com.example.project.mapper;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import com.example.project.entity.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UtilisateurMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "googleId", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "adminNotes", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "kycStatus", ignore = true)
    Utilisateur toEntity(UtilisateurRequestDTO dto);

    UtilisateurResponseDTO toResponseDTO(Utilisateur entity);

    UtilisateurRequestDTO toRequestDTO(Utilisateur entity);
}
