package com.example.threadbench.domain.benchmark.service;

import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.entity.MetricSnapshot;
import com.example.threadbench.domain.benchmark.repository.MetricSnapshotRepository;
import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
@RequiredArgsConstructor
public class BenchmarkRuntimeSnapshotService {

    private final MetricSnapshotRepository metricSnapshotRepository;
    private final BenchmarkExecutionProperties properties;
    private final DataSource dataSource;
    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;

    public AutoCloseable start(BenchmarkRun run) {
        recordSnapshot(run, "START");

        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(runnable -> {
            Thread thread = new Thread(runnable, "benchmark-snapshot-" + run.getId());
            thread.setDaemon(true);
            return thread;
        });

        scheduler.scheduleAtFixedRate(
                () -> recordSnapshot(run, "SAMPLE"),
                properties.getSamplingIntervalSeconds(),
                properties.getSamplingIntervalSeconds(),
                TimeUnit.SECONDS
        );

        AtomicBoolean closed = new AtomicBoolean(false);
        return () -> {
            if (!closed.compareAndSet(false, true)) {
                return;
            }
            scheduler.shutdownNow();
            recordSnapshot(run, "END");
        };
    }

    private void recordSnapshot(BenchmarkRun run, String snapshotType) {
        try {
            MetricSnapshot snapshot = new MetricSnapshot();
            snapshot.setBenchmarkRun(entityManager.getReference(BenchmarkRun.class, run.getId()));
            snapshot.setSnapshotType(snapshotType);
            snapshot.setRecordedAt(Instant.now());

            HikariPoolMXBean hikariPool = hikariPool();
            if (hikariPool != null) {
                snapshot.setActiveConnections(hikariPool.getActiveConnections());
                snapshot.setIdleConnections(hikariPool.getIdleConnections());
                snapshot.setPendingConnections(hikariPool.getThreadsAwaitingConnection());
                snapshot.setTotalConnections(hikariPool.getTotalConnections());
            }

            ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
            snapshot.setLiveThreads(threadMXBean.getThreadCount());
            snapshot.setDaemonThreads(threadMXBean.getDaemonThreadCount());
            snapshot.setPeakThreads(threadMXBean.getPeakThreadCount());
            snapshot.setTotalStartedThreads(threadMXBean.getTotalStartedThreadCount());
            snapshot.setPayloadJson(payloadJson(run, snapshotType, snapshot));

            metricSnapshotRepository.save(snapshot);
        } catch (Exception exception) {
            log.warn("Failed to record benchmark snapshot for run {}", run.getId(), exception);
        }
    }

    private HikariPoolMXBean hikariPool() {
        if (dataSource instanceof HikariDataSource hikariDataSource) {
            return hikariDataSource.getHikariPoolMXBean();
        }
        return null;
    }

    private String payloadJson(BenchmarkRun run, String snapshotType, MetricSnapshot snapshot) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("runId", run.getId());
        payload.put("correlationId", run.getCorrelationId());
        payload.put("mode", run.getMode());
        payload.put("scenario", run.getScenario());
        payload.put("snapshotType", snapshotType);
        payload.put("connectionPoolSize", run.getConnectionPoolSize());
        payload.put("activeConnections", snapshot.getActiveConnections());
        payload.put("idleConnections", snapshot.getIdleConnections());
        payload.put("pendingConnections", snapshot.getPendingConnections());
        payload.put("totalConnections", snapshot.getTotalConnections());
        payload.put("liveThreads", snapshot.getLiveThreads());
        payload.put("daemonThreads", snapshot.getDaemonThreads());
        payload.put("peakThreads", snapshot.getPeakThreads());
        payload.put("totalStartedThreads", snapshot.getTotalStartedThreads());

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            return "{\"error\":\"snapshot-payload-serialization-failed\"}";
        }
    }
}
