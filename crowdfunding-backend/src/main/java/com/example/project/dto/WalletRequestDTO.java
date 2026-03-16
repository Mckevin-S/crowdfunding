package com.example.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletRequestDTO {
    
    @NotNull(message = "L'ID utilisateur ne doit pas être nul")
    private Long utilisateurId;
    
    private BigDecimal solde;
}
