package com.example.project.mapper;

import com.example.project.dto.AnalyseIARequestDTO;
import com.example.project.dto.AnalyseIAResponseDTO;
import com.example.project.entity.AnalyseIA;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AnalyseIAMapper {

    AnalyseIAMapper INSTANCE = Mappers.getMapper(AnalyseIAMapper.class);

    @Mapping(target = "projet", ignore = true)
    AnalyseIA toEntity(AnalyseIARequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    AnalyseIAResponseDTO toResponseDTO(AnalyseIA entity);

    @Mapping(target = "projetId", source = "projet.id")
    AnalyseIARequestDTO toRequestDTO(AnalyseIA entity);
}
