package com.example.project.mapper;

import com.example.project.dto.KycDocumentRequestDTO;
import com.example.project.dto.KycDocumentResponseDTO;
import com.example.project.entity.KycDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface KycDocumentMapper {

    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "dateSoumission", ignore = true)
    KycDocument toEntity(KycDocumentRequestDTO dto);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    KycDocumentResponseDTO toResponseDTO(KycDocument entity);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    KycDocumentRequestDTO toRequestDTO(KycDocument entity);
}
