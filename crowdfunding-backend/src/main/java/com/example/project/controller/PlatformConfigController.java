package com.example.project.controller;

import com.example.project.dto.PlatformConfigDTO;
import com.example.project.service.interfaces.PlatformConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/configs")
@RequiredArgsConstructor
@Tag(name = "Configurations", description = "Administration des paramètres globaux")
@PreAuthorize("hasRole('ADMIN')")
public class PlatformConfigController {

    private final PlatformConfigService configService;

    @GetMapping
    @Operation(summary = "Lister les configurations", description = "Récupère toutes les variables système globales.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<PlatformConfigDTO>> getAllConfigs() {
        return ResponseEntity.ok(configService.getAllConfigs());
    }

    @PutMapping("/{key}")
    @Operation(summary = "Mettre à jour une configuration", description = "Modifie ou crée une variable globale.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<PlatformConfigDTO> updateConfig(
            @PathVariable String key,
            @RequestParam String value,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(configService.updateConfig(key, value, description));
    }
}
