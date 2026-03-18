package com.example.project.mapper;

import com.example.project.dto.UtilisateurRequestDTO;
import com.example.project.dto.UtilisateurResponseDTO;
import com.example.project.entity.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UtilisateurMapper {

    UtilisateurMapper INSTANCE = Mappers.getMapper(UtilisateurMapper.class);

    Utilisateur toEntity(UtilisateurRequestDTO dto);

    UtilisateurResponseDTO toResponseDTO(Utilisateur entity);

    UtilisateurRequestDTO toRequestDTO(Utilisateur entity);
}
