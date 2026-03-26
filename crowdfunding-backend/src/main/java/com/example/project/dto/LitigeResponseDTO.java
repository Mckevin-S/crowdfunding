package com.example.project.dto;

import com.example.project.enums.StatutLitige;
import com.example.project.enums.TypeLitige;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LitigeResponseDTO {
    private Long id;
    private String titre;
    private String description;
    private StatutLitige statut;
    private TypeLitige type;
    
    private Long plaignantId;
    private String plaignantNom;
    
    private Long accuseId;
    private String accuseNom;
    
    private Long projetConcerneId;
    private String projetConcerneTitre;
    
    private String decisionAdmin;
    private LocalDateTime dateCreation;
    private LocalDateTime dateResolution;
}
