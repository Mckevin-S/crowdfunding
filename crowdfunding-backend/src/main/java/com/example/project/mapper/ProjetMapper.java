package com.example.project.mapper;

import com.example.project.dto.ProjetRequestDTO;
import com.example.project.dto.ProjetResponseDTO;
import com.example.project.entity.Projet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjetMapper {

    @Mapping(target = "porteur", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "montantActuel", ignore = true)
    @Mapping(target = "adminNotes", ignore = true)
    @Mapping(target = "suspensionDeadline", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "localisation", ignore = true)
    @Mapping(target = "nombreContributeurs", ignore = true)
    @Mapping(target = "etapes", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    Projet toEntity(ProjetRequestDTO dto);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetResponseDTO toResponseDTO(Projet entity);

    @Mapping(target = "porteurId", source = "porteur.id")
    ProjetRequestDTO toRequestDTO(Projet entity);
}
