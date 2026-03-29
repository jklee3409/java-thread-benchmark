package com.example.threadbench.domain.system.service;

import com.example.threadbench.domain.system.dto.ModeResponse;
import com.example.threadbench.global.properties.AppProperties;
import com.example.threadbench.global.properties.ExternalApiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ModeService {

    private final AppProperties appProperties;
    private final ExternalApiProperties externalApiProperties;
    private final Environment environment;

    public ModeResponse currentMode() {
        return new ModeResponse(
                appProperties.getMode(),
                appProperties.getEnvironment(),
                Arrays.asList(environment.getActiveProfiles()),
                externalApiProperties.getBaseUrl()
        );
    }
}
