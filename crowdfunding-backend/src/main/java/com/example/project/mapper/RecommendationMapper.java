package com.example.project.mapper;

import com.example.project.dto.RecommendationRequestDTO;
import com.example.project.dto.RecommendationResponseDTO;
import com.example.project.entity.Recommendation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecommendationMapper {

    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "projet", ignore = true)
    Recommendation toEntity(RecommendationRequestDTO dto);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "projetId", source = "projet.id")
    RecommendationResponseDTO toResponseDTO(Recommendation entity);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "projetId", source = "projet.id")
    RecommendationRequestDTO toRequestDTO(Recommendation entity);
}
