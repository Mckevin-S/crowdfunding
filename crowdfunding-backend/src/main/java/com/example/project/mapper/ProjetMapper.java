package com.example.project.mapper;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.entity.Projet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjetMapper {

    @Mapping(target = "porteur", ignore = true)
    Projet toEntity(ProjetRequestDTO dto);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetResponseDTO toResponseDTO(Projet entity);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetRequestDTO toRequestDTO(Projet entity);
}
