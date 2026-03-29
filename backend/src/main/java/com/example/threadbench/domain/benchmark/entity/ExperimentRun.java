package com.example.threadbench.domain.benchmark.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "experiment_run")
@Getter
@Setter
@NoArgsConstructor
public class ExperimentRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40)
    private String mode;

    @Column(nullable = false, length = 100)
    private String scenario;

    @Column(nullable = false)
    private double throughput;

    @Column(name = "p95_latency_ms", nullable = false)
    private double p95LatencyMs;

    @Column(name = "error_rate", nullable = false)
    private double errorRate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public ExperimentRun(String mode, String scenario, double throughput, double p95LatencyMs, double errorRate) {
        this.mode = mode;
        this.scenario = scenario;
        this.throughput = throughput;
        this.p95LatencyMs = p95LatencyMs;
        this.errorRate = errorRate;
    }
}
