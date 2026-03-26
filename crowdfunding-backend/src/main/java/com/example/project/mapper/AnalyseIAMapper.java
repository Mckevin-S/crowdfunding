package com.example.project.mapper;

import com.example.project.dto.AnalyseIARequestDTO;
import com.example.project.dto.AnalyseIAResponseDTO;
import com.example.project.entity.AnalyseIA;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnalyseIAMapper {

    @Mapping(target = "projet", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    AnalyseIA toEntity(AnalyseIARequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    AnalyseIAResponseDTO toResponseDTO(AnalyseIA entity);

    @Mapping(target = "projetId", source = "projet.id")
    AnalyseIARequestDTO toRequestDTO(AnalyseIA entity);
}
