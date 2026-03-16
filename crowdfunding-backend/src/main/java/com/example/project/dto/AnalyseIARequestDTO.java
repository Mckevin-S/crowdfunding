package com.example.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyseIARequestDTO {
    
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    private Float scoreSucces;
    
    private Float scoreRisque;
    
    private String analyse;
}
