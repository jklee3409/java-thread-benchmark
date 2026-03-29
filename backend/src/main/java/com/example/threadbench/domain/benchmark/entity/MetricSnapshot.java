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

import java.time.Instant;

@Entity
@Table(name = "metric_snapshot")
@Getter
@Setter
@NoArgsConstructor
public class MetricSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "benchmark_run_id", nullable = false)
    private BenchmarkRun benchmarkRun;

    @Column(name = "snapshot_type", nullable = false, length = 20)
    private String snapshotType;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt = Instant.now();

    @Column(name = "active_connections", nullable = false)
    private int activeConnections;

    @Column(name = "idle_connections", nullable = false)
    private int idleConnections;

    @Column(name = "pending_connections", nullable = false)
    private int pendingConnections;

    @Column(name = "total_connections", nullable = false)
    private int totalConnections;

    @Column(name = "live_threads", nullable = false)
    private int liveThreads;

    @Column(name = "daemon_threads", nullable = false)
    private int daemonThreads;

    @Column(name = "peak_threads", nullable = false)
    private int peakThreads;

    @Column(name = "total_started_threads", nullable = false)
    private long totalStartedThreads;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;
}
