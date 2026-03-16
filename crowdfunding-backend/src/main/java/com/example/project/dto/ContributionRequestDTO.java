package com.example.project.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContributionRequestDTO {
    
    @NotNull(message = "Le montant ne doit pas être nul")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal amount;
    
    @NotNull(message = "L'ID du projet ne doit pas être nul")
    private Long projetId;
    
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;
}
