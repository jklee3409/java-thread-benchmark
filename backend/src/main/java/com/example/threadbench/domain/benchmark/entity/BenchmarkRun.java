package com.example.threadbench.domain.benchmark.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "benchmark_run")
@Getter
@Setter
@NoArgsConstructor
public class BenchmarkRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "correlation_id", nullable = false, length = 36, unique = true)
    private String correlationId;

    @Column(nullable = false, length = 20)
    private String mode;

    @Column(nullable = false, length = 20)
    private String scenario;

    @Column(name = "request_path", nullable = false, length = 255)
    private String requestPath;

    @Column(name = "sample_id")
    private Long sampleId;

    @Column(name = "external_delay_ms")
    private Integer externalDelayMs;

    @Column(name = "external_status")
    private Integer externalStatus;

    @Column(name = "db_hold_ms")
    private Integer dbHoldMs;

    @Column(name = "thread_count", nullable = false)
    private int threadCount;

    @Column(name = "ramp_up_seconds", nullable = false)
    private int rampUpSeconds;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "loop_count", nullable = false)
    private int loopCount;

    @Column(name = "connection_pool_size", nullable = false)
    private int connectionPoolSize;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "failure_message", columnDefinition = "TEXT")
    private String failureMessage;

    @Column(name = "result_file_path", length = 500)
    private String resultFilePath;

    @Column(name = "jmeter_log_path", length = 500)
    private String jmeterLogPath;

    @Column(name = "process_output_path", length = 500)
    private String processOutputPath;

    @Column(name = "total_samples", nullable = false)
    private int totalSamples;

    @Column(name = "success_samples", nullable = false)
    private int successSamples;

    @Column(name = "error_samples", nullable = false)
    private int errorSamples;

    @Column(name = "average_latency_ms", nullable = false)
    private double averageLatencyMs;

    @Column(name = "p95_latency_ms", nullable = false)
    private double p95LatencyMs;

    @Column(name = "p99_latency_ms", nullable = false)
    private double p99LatencyMs;

    @Column(nullable = false)
    private double throughput;

    @Column(name = "error_rate", nullable = false)
    private double errorRate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}
