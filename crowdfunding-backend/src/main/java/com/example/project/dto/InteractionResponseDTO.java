package com.example.project.dto;

import com.example.project.enums.InteractionType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InteractionResponseDTO {
    private Long id;
    private Long projetId;
    private Long utilisateurId;
    private InteractionType type;
    private LocalDateTime dateCreation;
}
