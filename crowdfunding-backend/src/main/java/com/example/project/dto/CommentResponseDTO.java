package com.example.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDTO {
    private Long id;
    private Long projetId;
    private Long utilisateurId;
    private String utilisateurNom;
    private String contenu;
    private LocalDateTime dateCreation;
}
