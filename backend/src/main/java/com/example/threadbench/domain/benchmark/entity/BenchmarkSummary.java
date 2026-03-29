package com.example.threadbench.domain.benchmark.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "benchmark_summary")
@Getter
@Setter
@NoArgsConstructor
public class BenchmarkSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "benchmark_run_id", nullable = false, unique = true)
    private BenchmarkRun benchmarkRun;

    @Column(name = "error_rate", nullable = false)
    private double errorRate;

    @Column(name = "p99_latency_ms", nullable = false)
    private double p99LatencyMs;

    @Column(name = "bottleneck_layer", length = 20)
    private String bottleneckLayer;

    @Column(name = "summary_text", nullable = false, columnDefinition = "TEXT")
    private String summaryText;

    @Column(name = "recommendation_text", nullable = false, columnDefinition = "TEXT")
    private String recommendationText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
