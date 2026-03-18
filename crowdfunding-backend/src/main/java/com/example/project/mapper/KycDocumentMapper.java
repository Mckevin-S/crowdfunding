package com.example.project.mapper;

import com.example.project.dto.KycDocumentRequestDTO;
import com.example.project.dto.KycDocumentResponseDTO;
import com.example.project.entity.KycDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface KycDocumentMapper {

    KycDocumentMapper INSTANCE = Mappers.getMapper(KycDocumentMapper.class);

    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "statut", ignore = true)
    KycDocument toEntity(KycDocumentRequestDTO dto);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    KycDocumentResponseDTO toResponseDTO(KycDocument entity);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    KycDocumentRequestDTO toRequestDTO(KycDocument entity);
}
