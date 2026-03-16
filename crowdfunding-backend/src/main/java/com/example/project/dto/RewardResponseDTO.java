package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardResponseDTO {
    
    private Long id;
    
    private Long projetId;
    
    private String titre;
    
    private String description;
    
    private BigDecimal montantMinimum;
    
    private Integer quantite;
}
