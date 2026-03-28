package com.example.threadbench.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@Getter
@Setter
@ConfigurationProperties(prefix = "external-api")
public class ExternalApiProperties {

    @NotBlank
    private String baseUrl;

    @Positive
    private int connectTimeoutMs = 2000;

    @Positive
    private int readTimeoutMs = 5000;
}
