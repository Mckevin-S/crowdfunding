package com.example.project.dto;

import com.example.project.enums.TypeLitige;
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
public class LitigeRequestDTO {

    @NotBlank(message = "Le titre du litige est obligatoire")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le type de litige est obligatoire")
    private TypeLitige type;

    private Long accuseId; // Celui contre qui on porte le litige
    
    private Long projetConcerneId; // Le projet impliqué
}
