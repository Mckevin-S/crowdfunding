package com.example.project.mapper;

import com.example.project.dto.WalletRequestDTO;
import com.example.project.dto.WalletResponseDTO;
import com.example.project.entity.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface WalletMapper {
    
    WalletMapper INSTANCE = Mappers.getMapper(WalletMapper.class);
    
    @Mapping(target = "utilisateur", ignore = true)
    Wallet toEntity(WalletRequestDTO dto);
    
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    WalletResponseDTO toResponseDTO(Wallet entity);
    
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    WalletRequestDTO toRequestDTO(Wallet entity);
}
