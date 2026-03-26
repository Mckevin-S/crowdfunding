package com.example.project.mapper;

import com.example.project.dto.NotificationRequestDTO;
import com.example.project.dto.NotificationResponseDTO;
import com.example.project.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "estLu", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    Notification toEntity(NotificationRequestDTO dto);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    NotificationResponseDTO toResponseDTO(Notification entity);

    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "sendEmail", ignore = true)
    NotificationRequestDTO toRequestDTO(Notification entity);
}
