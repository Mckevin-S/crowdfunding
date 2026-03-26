package com.example.project.mapper;

import com.example.project.dto.TransactionRequestDTO;
import com.example.project.dto.TransactionResponseDTO;
import com.example.project.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sourceAmount", ignore = true)
    @Mapping(target = "sourceCurrency", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    Transaction toEntity(TransactionRequestDTO dto);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    TransactionResponseDTO toResponseDTO(Transaction entity);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    TransactionRequestDTO toRequestDTO(Transaction entity);
}
