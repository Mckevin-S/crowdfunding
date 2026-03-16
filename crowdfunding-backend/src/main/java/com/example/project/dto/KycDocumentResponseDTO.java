package com.example.project.dto;

import com.example.project.enums.TypeDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentResponseDTO {
    
    private Long id;
    
    private Long utilisateurId;
    
    private TypeDocument typeDocument;
    
    private String documentUrl;
    
    private Boolean estVerifie;
    
    private LocalDateTime dateSoumission;
}
