package com.example.project.mapper;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import com.example.project.entity.Contribution;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContributionMapper {

    @Mapping(target = "projet", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    Contribution toEntity(ContributionRequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    ContributionResponseDTO toResponseDTO(Contribution entity);

    @Mapping(target = "projetId", source = "projet.id")
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    ContributionRequestDTO toRequestDTO(Contribution entity);
}
