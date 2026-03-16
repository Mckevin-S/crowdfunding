package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyseIAResponseDTO {
    
    private Long id;
    
    private Long projetId;
    
    private Float scoreSucces;
    
    private Float scoreRisque;
    
    private String analyse;
    
    private LocalDateTime dateCreation;
}
