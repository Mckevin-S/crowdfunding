package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    
    private Long id;
    
    private Long utilisateurId;
    
    private Long projetId;
    
    private Float scoreAffinite;
}
