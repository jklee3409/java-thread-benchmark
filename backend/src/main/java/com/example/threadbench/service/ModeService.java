package com.example.threadbench.service;

import com.example.threadbench.config.AppProperties;
import com.example.threadbench.config.ExternalApiProperties;
import com.example.threadbench.dto.ModeResponse;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class ModeService {

    private final AppProperties appProperties;
    private final ExternalApiProperties externalApiProperties;
    private final Environment environment;

    public ModeService(AppProperties appProperties, ExternalApiProperties externalApiProperties, Environment environment) {
        this.appProperties = appProperties;
        this.externalApiProperties = externalApiProperties;
        this.environment = environment;
    }

    public ModeResponse currentMode() {
        return new ModeResponse(
                appProperties.getMode(),
                appProperties.getEnvironment(),
                Arrays.asList(environment.getActiveProfiles()),
                externalApiProperties.getBaseUrl()
        );
    }
}
