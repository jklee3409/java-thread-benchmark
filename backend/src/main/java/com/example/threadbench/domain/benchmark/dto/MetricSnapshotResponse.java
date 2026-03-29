package com.example.threadbench.domain.benchmark.dto;

import java.time.Instant;

public record MetricSnapshotResponse(
        String snapshotType,
        Instant recordedAt,
        int activeConnections,
        int idleConnections,
        int pendingConnections,
        int totalConnections,
        int liveThreads,
        int daemonThreads,
        int peakThreads,
        long totalStartedThreads,
        String payloadJson
) {
}
