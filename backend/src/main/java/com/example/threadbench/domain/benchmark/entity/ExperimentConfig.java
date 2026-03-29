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
@Table(name = "experiment_config")
@Getter
@Setter
@NoArgsConstructor
public class ExperimentConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "benchmark_run_id", nullable = false, unique = true)
    private BenchmarkRun benchmarkRun;

    @Column(name = "thread_mode", nullable = false, length = 20)
    private String threadMode;

    @Column(name = "scenario_code", nullable = false, length = 40)
    private String scenarioCode;

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

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
