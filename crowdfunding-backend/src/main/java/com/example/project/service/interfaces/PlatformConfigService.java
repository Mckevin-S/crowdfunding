package com.example.project.service.interfaces;

import com.example.project.dto.PlatformConfigDTO;
import java.util.List;

public interface PlatformConfigService {
    List<PlatformConfigDTO> getAllConfigs();
    PlatformConfigDTO getConfig(String key);
    PlatformConfigDTO updateConfig(String key, String value, String description);
}
