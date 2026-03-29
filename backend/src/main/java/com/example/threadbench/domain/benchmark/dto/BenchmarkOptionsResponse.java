package com.example.threadbench.domain.benchmark.dto;

import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;

import java.util.List;

public record BenchmarkOptionsResponse(
        String currentMode,
        int defaultExternalDelayMs,
        int defaultDbHoldMs,
        int defaultThreadCount,
        int defaultRampUpSeconds,
        int defaultDurationSeconds,
        int defaultLoopCount,
        List<BenchmarkScenario> scenarios
) {
}
