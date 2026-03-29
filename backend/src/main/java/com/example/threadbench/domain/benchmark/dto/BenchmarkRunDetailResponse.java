package com.example.threadbench.domain.benchmark.dto;

import com.example.threadbench.domain.benchmark.model.BenchmarkRunStatus;
import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;

import java.time.Instant;
import java.util.List;

public record BenchmarkRunDetailResponse(
        Long id,
        String correlationId,
        String mode,
        BenchmarkScenario scenario,
        BenchmarkRunStatus status,
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
        int totalSamples,
        int successSamples,
        int errorSamples,
        double averageLatencyMs,
        double p95LatencyMs,
        double p99LatencyMs,
        double throughput,
        double errorRate,
        String failureMessage,
        String resultFilePath,
        String jmeterLogPath,
        String processOutputPath,
        Instant createdAt,
        Instant startedAt,
        Instant completedAt,
        ExperimentConfigResponse experimentConfig,
        BenchmarkSummaryResponse benchmarkSummary,
        List<MetricSnapshotResponse> metricSnapshots,
        List<BottleneckAnalysisNoteResponse> bottleneckNotes,
        List<BenchmarkLayerMetricResponse> layerMetrics
) {
}
