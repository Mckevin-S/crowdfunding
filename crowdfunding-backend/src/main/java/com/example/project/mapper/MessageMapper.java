package com.example.project.mapper;

import com.example.project.dto.MessageRequestDTO;
import com.example.project.dto.MessageResponseDTO;
import com.example.project.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "expediteur", ignore = true)
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "projet", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lu", ignore = true)
    @Mapping(target = "dateEnvoi", ignore = true)
    Message toEntity(MessageRequestDTO dto);

    @Mapping(target = "expediteurId", source = "expediteur.id")
    @Mapping(target = "expediteurNomPrenom", expression = "java(entity.getExpediteur() != null ? entity.getExpediteur().getPrenom() + ' ' + entity.getExpediteur().getNom() : 'Utilisateur Inconnu')")
    @Mapping(target = "expediteurAvatarUrl", source = "expediteur.avatarUrl")
    @Mapping(target = "destinataireId", source = "destinataire.id")
    @Mapping(target = "projetId", source = "projet.id")
    @Mapping(target = "projetTitre", source = "projet.titre")
    MessageResponseDTO toResponseDTO(Message entity);
}
