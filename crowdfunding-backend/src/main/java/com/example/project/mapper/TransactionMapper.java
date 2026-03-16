package com.example.project.mapper;

import com.example.project.dto.TransactionRequestDTO;
import com.example.project.dto.TransactionResponseDTO;
import com.example.project.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
    
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "status", ignore = true)
    Transaction toEntity(TransactionRequestDTO dto);
    
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    TransactionResponseDTO toResponseDTO(Transaction entity);
    
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    TransactionRequestDTO toRequestDTO(Transaction entity);
}
