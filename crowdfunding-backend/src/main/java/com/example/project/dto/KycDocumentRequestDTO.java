package com.example.project.dto;

import com.example.project.enums.TypeDocument;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentRequestDTO {
    
    @NotNull(message = "L'ID de l'utilisateur ne doit pas être nul")
    private Long utilisateurId;
    
    @NotNull(message = "Le type de document ne doit pas être nul")
    private TypeDocument typeDocument;
    
    @NotNull(message = "L'URL du document ne doit pas être nulle")
    private String documentUrl;
}
