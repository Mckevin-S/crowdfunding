package com.example.project.service.impl;

import com.example.project.dto.PlatformConfigDTO;
import com.example.project.entity.PlatformConfig;
import com.example.project.entity.Utilisateur;
import com.example.project.repository.PlatformConfigRepository;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.service.interfaces.AuditLogService;
import com.example.project.service.interfaces.PlatformConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformConfigServiceImpl implements PlatformConfigService {

    private final PlatformConfigRepository configRepository;
    private final AuditLogService auditLogService;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public List<PlatformConfigDTO> getAllConfigs() {
        return configRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlatformConfigDTO getConfig(String key) {
        return configRepository.findByConfigKey(key)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public PlatformConfigDTO updateConfig(String key, String value, String description) {
        PlatformConfig config = configRepository.findByConfigKey(key).orElse(new PlatformConfig());
        config.setConfigKey(key);
        config.setConfigValue(value);
        if (description != null) {
            config.setDescription(description);
        }
        PlatformConfig saved = configRepository.save(config);

        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Utilisateur admin = utilisateurRepository.findByEmail(currentUserEmail).orElse(null);
            if (admin != null) {
                auditLogService.logAction(
                    admin.getId(), 
                    "CONFIG_UPDATE", 
                    null, 
                    "Key: " + key + ", new Value: " + value
                );
            }
        } catch (Exception ignored) {}

        return mapToDto(saved);
    }

    private PlatformConfigDTO mapToDto(PlatformConfig entity) {
        return PlatformConfigDTO.builder()
                .id(entity.getId())
                .configKey(entity.getConfigKey())
                .configValue(entity.getConfigValue())
                .description(entity.getDescription())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
