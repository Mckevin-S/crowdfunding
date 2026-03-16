package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponseDTO {
    
    private Long id;
    
    private Long utilisateurId;
    
    private BigDecimal solde;
    
    private LocalDateTime dateCreation;
}
