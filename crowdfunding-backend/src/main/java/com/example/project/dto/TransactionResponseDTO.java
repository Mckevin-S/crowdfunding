package com.example.project.dto;

import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {
    
    private Long id;
    
    private Long utilisateurId;
    
    private BigDecimal amount;
    
    private PaiementType type;
    
    private StatutTransaction status;
    
    private LocalDateTime dateCreation;
}
