package com.example.threadbench.domain.benchmark.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "benchmark_layer_metric")
@Getter
@Setter
@NoArgsConstructor
public class BenchmarkLayerMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "benchmark_run_id", nullable = false)
    private BenchmarkRun benchmarkRun;

    @Column(nullable = false, length = 20)
    private String layer;

    @Column(name = "invocation_count", nullable = false)
    private long invocationCount;

    @Column(name = "error_count", nullable = false)
    private long errorCount;

    @Column(name = "timeout_count", nullable = false)
    private long timeoutCount;

    @Column(name = "average_latency_ms", nullable = false)
    private double averageLatencyMs;

    @Column(name = "p95_latency_ms", nullable = false)
    private double p95LatencyMs;

    @Column(name = "p99_latency_ms", nullable = false)
    private double p99LatencyMs;

    @Column(name = "max_latency_ms", nullable = false)
    private double maxLatencyMs;
}
