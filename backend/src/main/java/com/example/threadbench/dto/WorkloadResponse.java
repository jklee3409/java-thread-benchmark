package com.example.threadbench.dto;

public record WorkloadResponse(
        String scenario,
        String mode,
        long itemId,
        String value,
        int externalDelayMs
) {
}
