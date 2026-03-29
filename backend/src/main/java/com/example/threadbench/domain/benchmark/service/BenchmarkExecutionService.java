package com.example.threadbench.domain.benchmark.service;

import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.model.BenchmarkRunStatus;
import com.example.threadbench.domain.benchmark.repository.BenchmarkLayerMetricRepository;
import com.example.threadbench.domain.benchmark.repository.BenchmarkRunRepository;
import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import com.example.threadbench.infrastructure.jmeter.JMeterCommandBuilder;
import com.example.threadbench.infrastructure.jmeter.JMeterResultParser;
import com.example.threadbench.infrastructure.jmeter.model.BenchmarkExecutionPlan;
import com.example.threadbench.infrastructure.jmeter.model.JMeterRunSummary;
import com.example.threadbench.infrastructure.monitoring.BenchmarkTelemetryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BenchmarkExecutionService {

    private final BenchmarkRunRepository benchmarkRunRepository;
    private final BenchmarkLayerMetricRepository benchmarkLayerMetricRepository;
    private final BenchmarkTelemetryService benchmarkTelemetryService;
    private final JMeterCommandBuilder jmeterCommandBuilder;
    private final JMeterResultParser jmeterResultParser;
    private final BenchmarkExecutionProperties properties;
    private final BenchmarkRuntimeSnapshotService benchmarkRuntimeSnapshotService;
    private final BenchmarkInsightService benchmarkInsightService;
    private final ExternalApiStubService externalApiStubService;

    @Qualifier("benchmarkTaskExecutor")
    private final TaskExecutor benchmarkTaskExecutor;

    public void enqueue(Long runId) {
        benchmarkTaskExecutor.execute(() -> execute(runId));
    }

    private void execute(Long runId) {
        BenchmarkRun run = benchmarkRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("Benchmark run not found: " + runId));

        benchmarkTelemetryService.initializeRun(run.getCorrelationId());
        AutoCloseable snapshotSession = null;
        String externalStubId = null;

        try {
            BenchmarkExecutionPlan plan = jmeterCommandBuilder.prepare(run);
            externalStubId = externalApiStubService.registerRunStub(run);
            run.setStatus(BenchmarkRunStatus.RUNNING.name());
            run.setStartedAt(Instant.now());
            run.setResultFilePath(plan.resultsFile().toString());
            run.setJmeterLogPath(plan.jmeterLogFile().toString());
            run.setProcessOutputPath(plan.processOutputFile().toString());
            benchmarkRunRepository.save(run);
            snapshotSession = benchmarkRuntimeSnapshotService.start(run);

            ProcessBuilder processBuilder = new ProcessBuilder(plan.command());
            processBuilder.directory(plan.runDirectory().toFile());
            processBuilder.redirectErrorStream(true);
            processBuilder.redirectOutput(plan.processOutputFile().toFile());

            Process process = processBuilder.start();
            boolean finished = process.waitFor(
                    run.getDurationSeconds() + run.getRampUpSeconds() + properties.getProcessTimeoutBufferSeconds(),
                    TimeUnit.SECONDS
            );

            if (!finished) {
                process.destroyForcibly();
                finishFailed(run, "JMeter process timed out");
                closeSnapshot(snapshotSession);
                snapshotSession = null;
                benchmarkInsightService.publish(run, persistLayerMetrics(run));
                return;
            }

            int exitCode = process.exitValue();
            run.setCompletedAt(Instant.now());
            closeSnapshot(snapshotSession);
            snapshotSession = null;

            JMeterRunSummary summary =
                    jmeterResultParser.parse(plan.resultsFile(), run.getStartedAt(), run.getCompletedAt());
            applySummary(run, summary);
            java.util.List<com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric> layerMetrics =
                    persistLayerMetrics(run);

            if (exitCode == 0) {
                run.setStatus(BenchmarkRunStatus.SUCCEEDED.name());
                run.setFailureMessage(null);
            } else {
                run.setStatus(BenchmarkRunStatus.FAILED.name());
                run.setFailureMessage("JMeter exited with code " + exitCode);
            }
            benchmarkInsightService.publish(run, layerMetrics);
            benchmarkRunRepository.save(run);
        } catch (Exception exception) {
            finishFailed(run, exception.getMessage());
            closeSnapshot(snapshotSession);
            benchmarkInsightService.publish(run, persistLayerMetrics(run));
        } finally {
            closeSnapshot(snapshotSession);
            externalApiStubService.removeRunStub(externalStubId);
            benchmarkTelemetryService.discard(run.getCorrelationId());
        }
    }

    private void finishFailed(BenchmarkRun run, String failureMessage) {
        run.setCompletedAt(Instant.now());
        run.setStatus(BenchmarkRunStatus.FAILED.name());
        run.setFailureMessage(failureMessage);
        benchmarkRunRepository.save(run);
    }

    private static void applySummary(BenchmarkRun run, JMeterRunSummary summary) {
        run.setTotalSamples(summary.totalSamples());
        run.setSuccessSamples(summary.successSamples());
        run.setErrorSamples(summary.errorSamples());
        run.setAverageLatencyMs(summary.averageLatencyMs());
        run.setP95LatencyMs(summary.p95LatencyMs());
        run.setP99LatencyMs(summary.p99LatencyMs());
        run.setErrorRate(summary.errorRate());
        run.setThroughput(summary.throughput());
    }

    private java.util.List<com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric> persistLayerMetrics(BenchmarkRun run) {
        benchmarkLayerMetricRepository.deleteByBenchmarkRun_Id(run.getId());
        java.util.List<com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric> metrics =
                benchmarkTelemetryService.drain(run);
        if (!metrics.isEmpty()) {
            benchmarkLayerMetricRepository.saveAll(metrics);
        }
        return metrics;
    }

    private void closeSnapshot(AutoCloseable snapshotSession) {
        if (snapshotSession == null) {
            return;
        }
        try {
            snapshotSession.close();
        } catch (Exception ignored) {
        }
    }
}
