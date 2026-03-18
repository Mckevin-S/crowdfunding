package com.example.project.mapper;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.entity.Projet;
import com.example.project.entity.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProjetMapper {

    ProjetMapper INSTANCE = Mappers.getMapper(ProjetMapper.class);

    @Mapping(target = "porteur", ignore = true)
    Projet toEntity(ProjetRequestDTO dto);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetResponseDTO toResponseDTO(Projet entity);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetRequestDTO toRequestDTO(Projet entity);
}
