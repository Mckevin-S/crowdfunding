package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    
    private Long id;
    
    private Long utilisateurId;
    
    private String message;
    
    private Boolean estLu;
    
    private LocalDateTime dateCreation;
}
