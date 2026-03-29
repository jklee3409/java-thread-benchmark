package com.example.threadbench.domain.benchmark.dto;

import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record BenchmarkRunRequest(
        @NotNull BenchmarkScenario scenario,
        @Positive Long sampleId,
        @Positive Integer delayMs,
        @Min(100) @Max(599) Integer externalStatus,
        @Min(0) Integer dbHoldMs,
        @Positive Integer threadCount,
        @Min(0) Integer rampUpSeconds,
        @Positive Integer durationSeconds,
        @Positive Integer loopCount
) {
}
