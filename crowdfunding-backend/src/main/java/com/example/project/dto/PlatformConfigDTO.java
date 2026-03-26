package com.example.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformConfigDTO {
    private Long id;
    
    @NotBlank(message = "La clé de configuration est obligatoire")
    private String configKey;
    
    @NotBlank(message = "La valeur de configuration est obligatoire")
    private String configValue;
    
    private String description;
    
    private LocalDateTime updatedAt;
}
