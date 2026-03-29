package com.example.threadbench.domain.benchmark.dto;

import java.time.Instant;

public record BenchmarkSummaryResponse(
        double errorRate,
        double p99LatencyMs,
        String bottleneckLayer,
        String summaryText,
        String recommendationText,
        Instant createdAt
) {
}
