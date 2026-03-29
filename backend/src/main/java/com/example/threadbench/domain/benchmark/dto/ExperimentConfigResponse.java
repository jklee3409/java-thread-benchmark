package com.example.threadbench.domain.benchmark.dto;

import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;

import java.time.Instant;

public record ExperimentConfigResponse(
        String threadMode,
        BenchmarkScenario scenario,
        String requestPath,
        Long sampleId,
        Integer externalDelayMs,
        Integer externalStatus,
        Integer dbHoldMs,
        int threadCount,
        int rampUpSeconds,
        int durationSeconds,
        int loopCount,
        int connectionPoolSize,
        Instant createdAt
) {
}
