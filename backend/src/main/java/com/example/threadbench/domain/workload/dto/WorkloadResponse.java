package com.example.threadbench.domain.workload.dto;

public record WorkloadResponse(
        String scenario,
        String mode,
        long itemId,
        String value,
        int externalDelayMs,
        Integer dbHoldMs
) {
}
