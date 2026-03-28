package com.example.threadbench.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "benchmark")
public class AppProperties {

    @NotBlank
    private String mode = "PLATFORM";

    @NotBlank
    private String environment = "local";

    @Min(1)
    private int defaultExternalDelayMs = 100;

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public int getDefaultExternalDelayMs() {
        return defaultExternalDelayMs;
    }

    public void setDefaultExternalDelayMs(int defaultExternalDelayMs) {
        this.defaultExternalDelayMs = defaultExternalDelayMs;
    }
}
