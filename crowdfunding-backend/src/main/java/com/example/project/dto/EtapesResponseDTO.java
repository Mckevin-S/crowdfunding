package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtapesResponseDTO {
    
    private Long id;
    
    private Long projetId;
    
    private String titre;
    
    private String description;
    
    private Integer progress;
    
    private Boolean estTermine;
}
