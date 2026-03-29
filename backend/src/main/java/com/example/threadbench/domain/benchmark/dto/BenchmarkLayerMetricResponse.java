package com.example.threadbench.domain.benchmark.dto;

public record BenchmarkLayerMetricResponse(
        String layer,
        long invocationCount,
        long errorCount,
        long timeoutCount,
        double averageLatencyMs,
        double p95LatencyMs,
        double p99LatencyMs,
        double maxLatencyMs
) {
}
