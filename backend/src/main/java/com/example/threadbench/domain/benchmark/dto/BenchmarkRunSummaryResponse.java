package com.example.threadbench.domain.benchmark.dto;

import com.example.threadbench.domain.benchmark.model.BenchmarkRunStatus;
import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;

import java.time.Instant;

public record BenchmarkRunSummaryResponse(
        Long id,
        String mode,
        BenchmarkScenario scenario,
        BenchmarkRunStatus status,
        int threadCount,
        int durationSeconds,
        int totalSamples,
        int errorSamples,
        double throughput,
        double p95LatencyMs,
        double p99LatencyMs,
        double errorRate,
        Instant createdAt,
        Instant startedAt,
        Instant completedAt
) {
}
