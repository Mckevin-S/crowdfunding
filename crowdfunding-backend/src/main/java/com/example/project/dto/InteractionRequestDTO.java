package com.example.project.dto;

import com.example.project.enums.InteractionType;
import lombok.Data;

@Data
public class InteractionRequestDTO {
    private Long projetId;
    private Long utilisateurId;
    private InteractionType type;
}
