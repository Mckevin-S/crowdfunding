package com.example.project.dto;

import com.example.project.enums.StatutProjet;
import com.example.project.enums.TypeFinancement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjetRequestDTO {
    
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String titre;
    
    @NotBlank(message = "La description ne doit pas être vide")
    private String description;
    
    @NotNull(message = "L'objectif financier ne doit pas être nul")
    private BigDecimal objectifFinancier;
    
    @NotNull(message = "Le type de financement ne doit pas être nul")
    private TypeFinancement typeFinancement;
    
    @NotNull(message = "La date de début ne doit pas être nulle")
    private LocalDate dateDebut;
    
    @NotNull(message = "La date de fin ne doit pas être nulle")
    private LocalDate dateFin;
    
    private StatutProjet statut;
    
    private Long porteurId;
}
