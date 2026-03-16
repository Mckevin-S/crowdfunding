package com.example.project.dto;

import com.example.project.enums.ContribStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContributionResponseDTO {
    
    private Long id;
    
    private Long projetId;
    
    private Long utilisateurId;
    
    private BigDecimal amount;
    
    private ContribStatus status;
    
    private LocalDateTime dateContribution;
}
