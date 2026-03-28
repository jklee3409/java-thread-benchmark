package com.example.threadbench.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "experiment_run")
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

    public ExperimentRun() {
    }

    public ExperimentRun(String mode, String scenario, double throughput, double p95LatencyMs, double errorRate) {
        this.mode = mode;
        this.scenario = scenario;
        this.throughput = throughput;
        this.p95LatencyMs = p95LatencyMs;
        this.errorRate = errorRate;
    }

    public Long getId() {
        return id;
    }

    public String getMode() {
        return mode;
    }

    public String getScenario() {
        return scenario;
    }

    public double getThroughput() {
        return throughput;
    }

    public double getP95LatencyMs() {
        return p95LatencyMs;
    }

    public double getErrorRate() {
        return errorRate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public void setScenario(String scenario) {
        this.scenario = scenario;
    }

    public void setThroughput(double throughput) {
        this.throughput = throughput;
    }

    public void setP95LatencyMs(double p95LatencyMs) {
        this.p95LatencyMs = p95LatencyMs;
    }

    public void setErrorRate(double errorRate) {
        this.errorRate = errorRate;
    }
}
