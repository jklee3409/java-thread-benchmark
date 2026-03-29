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
@ConfigurationProperties(prefix = "benchmark.execution")
public class BenchmarkExecutionProperties {

    @NotBlank
    private String jmeterExecutable = "jmeter";

    @NotBlank
    private String resultsDir = "build/benchmark-results";

    private String baseUrl;

    private String testPlanPath;

    @Min(1)
    private int defaultThreadCount = 50;

    @Min(0)
    private int defaultRampUpSeconds = 5;

    @Min(1)
    private int defaultDurationSeconds = 60;

    @Min(1)
    private int defaultLoopCount = 10000;

    @Min(0)
    private int defaultDbHoldMs = 150;

    @Min(1)
    private int executorThreads = 2;

    @Min(5)
    private int processTimeoutBufferSeconds = 30;

    @Min(1)
    private int samplingIntervalSeconds = 5;
}
