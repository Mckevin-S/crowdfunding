package com.example.project.mapper;

import com.example.project.dto.RewardRequestDTO;
import com.example.project.dto.RewardResponseDTO;
import com.example.project.entity.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RewardMapper {

    @Mapping(target = "projet", ignore = true)
    Reward toEntity(RewardRequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    RewardResponseDTO toResponseDTO(Reward entity);

    @Mapping(target = "projetId", source = "projet.id")
    RewardRequestDTO toRequestDTO(Reward entity);
}
