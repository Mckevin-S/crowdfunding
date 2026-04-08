package com.example.project.mapper;

import com.example.project.dto.ContributionRequestDTO;
import com.example.project.dto.ContributionResponseDTO;
import com.example.project.entity.Contribution;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContributionMapper {

    @Mapping(target = "projet", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sourceAmount", ignore = true)
    @Mapping(target = "sourceCurrency", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "stripePaymentIntentId", ignore = true)
    @Mapping(target = "mobileMoneyReference", ignore = true)
    @Mapping(target = "reward", ignore = true)
    @Mapping(target = "actionsRecues", ignore = true)
    @Mapping(target = "anonyme", ignore = true)
    @Mapping(target = "dateContribution", ignore = true)
    @Mapping(target = "dateMiseAJour", ignore = true)
    Contribution toEntity(ContributionRequestDTO dto);

    @Mapping(target = "projetId", source = "projet.id")
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "paymentMetadata", ignore = true)
    ContributionResponseDTO toResponseDTO(Contribution entity);

    @Mapping(target = "projetId", source = "projet.id")
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "rewardId", source = "reward.id")
    @Mapping(target = "currency", ignore = true)
    ContributionRequestDTO toRequestDTO(Contribution entity);
}
