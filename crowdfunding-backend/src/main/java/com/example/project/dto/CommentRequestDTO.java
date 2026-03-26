package com.example.project.dto;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private Long projetId;
    private Long utilisateurId;
    private String contenu;
}
