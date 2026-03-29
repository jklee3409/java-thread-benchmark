package com.example.threadbench.global.properties;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@Getter
@Setter
@ConfigurationProperties(prefix = "benchmark")
public class AppProperties {

    @NotBlank
    private String mode = "PLATFORM";

    @NotBlank
    private String environment = "local";

    @Min(1)
    private int defaultExternalDelayMs = 100;
}
