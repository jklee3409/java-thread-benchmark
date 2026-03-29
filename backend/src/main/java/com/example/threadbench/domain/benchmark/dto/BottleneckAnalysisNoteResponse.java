package com.example.threadbench.domain.benchmark.dto;

import java.time.Instant;

public record BottleneckAnalysisNoteResponse(
        String severity,
        String layer,
        String message,
        Instant createdAt
) {
}
