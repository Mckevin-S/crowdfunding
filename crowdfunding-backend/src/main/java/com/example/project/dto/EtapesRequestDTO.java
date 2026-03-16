package com.example.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtapesRequestDTO {
    
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;
    
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;
    
    private Integer progress;
    
    private Boolean estTermine;
    
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
}
