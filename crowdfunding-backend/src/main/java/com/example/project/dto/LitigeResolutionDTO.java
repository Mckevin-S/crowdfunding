package com.example.project.dto;

import com.example.project.enums.StatutLitige;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LitigeResolutionDTO {

    @NotNull(message = "Le nouveau statut est obligatoire")
    private StatutLitige statut;

    @NotBlank(message = "La décision de l'administrateur est obligatoire")
    private String decisionAdmin;
}
