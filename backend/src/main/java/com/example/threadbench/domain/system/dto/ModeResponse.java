package com.example.threadbench.domain.system.dto;

import java.util.List;

public record ModeResponse(
        String mode,
        String environment,
        List<String> activeProfiles,
        String externalApiBaseUrl
) {
}
