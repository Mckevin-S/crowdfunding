package com.example.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardRequestDTO {
    
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;
    
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;
    
    @NotNull(message = "Le montant minimum ne doit pas être nul")
    @Positive(message = "Le montant minimum doit être positif")
    private BigDecimal montantMinimum;
    
    @NotNull(message = "La quantité ne doit pas être nulle")
    @Positive(message = "La quantité doit être positive")
    private Integer quantite;
    
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
}
