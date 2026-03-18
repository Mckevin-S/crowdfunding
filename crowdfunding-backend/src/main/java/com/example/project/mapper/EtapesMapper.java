package com.example.project.mapper;

import com.example.project.dto.EtapesRequestDTO;
import com.example.project.dto.EtapesResponseDTO;
import com.example.project.entity.Etapes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EtapesMapper {

    @Mapping(target = "projet", ignore = true)
    Etapes toEntity(EtapesRequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    EtapesResponseDTO toResponseDTO(Etapes entity);

    @Mapping(target = "projetId", source = "projet.id")
    EtapesRequestDTO toRequestDTO(Etapes entity);
}
