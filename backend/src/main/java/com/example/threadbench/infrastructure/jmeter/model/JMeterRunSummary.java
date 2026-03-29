package com.example.threadbench.infrastructure.jmeter.model;

public record JMeterRunSummary(
        int totalSamples,
        int successSamples,
        int errorSamples,
        double averageLatencyMs,
        double p95LatencyMs,
        double p99LatencyMs,
        double errorRate,
        double throughput
) {

    public static JMeterRunSummary empty() {
        return new JMeterRunSummary(0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }
}
