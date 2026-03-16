package com.example.project.dto;

import com.example.project.enums.StatutProjet;
import com.example.project.enums.TypeFinancement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjetResponseDTO {
    
    private Long id;
    
    private String titre;
    
    private String description;
    
    private BigDecimal objectifFinancier;
    
    private BigDecimal montantActuel;
    
    private TypeFinancement typeFinancement;
    
    private StatutProjet statut;
    
    private LocalDate dateDebut;
    
    private LocalDate dateFin;
    
    private Long porteurId;
}
