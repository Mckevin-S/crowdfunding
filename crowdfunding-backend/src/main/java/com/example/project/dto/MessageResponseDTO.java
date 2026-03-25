package com.example.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Réponse contenant un message")
public class MessageResponseDTO {

    private Long id;
    private Long expediteurId;
    private String expediteurNomPrenom;
    private String expediteurAvatarUrl;
    private Long destinataireId;
    private Long projetId;
    private String projetTitre;
    private String contenu;
    private boolean lu;
    private LocalDateTime dateEnvoi;
}
