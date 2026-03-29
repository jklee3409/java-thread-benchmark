package com.example.threadbench.domain.benchmark.service;

import com.example.threadbench.domain.benchmark.dto.BenchmarkOptionsResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunDetailResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunExportResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunRequest;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunSummaryResponse;
import com.example.threadbench.domain.benchmark.entity.BenchmarkSummary;
import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.entity.BottleneckAnalysisNote;
import com.example.threadbench.domain.benchmark.entity.ExperimentConfig;
import com.example.threadbench.domain.benchmark.entity.MetricSnapshot;
import com.example.threadbench.domain.benchmark.mapper.BenchmarkRunMapper;
import com.example.threadbench.domain.benchmark.model.BenchmarkRunStatus;
import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;
import com.example.threadbench.domain.benchmark.repository.BenchmarkLayerMetricRepository;
import com.example.threadbench.domain.benchmark.repository.BenchmarkRunRepository;
import com.example.threadbench.domain.benchmark.repository.BenchmarkSummaryRepository;
import com.example.threadbench.domain.benchmark.repository.BottleneckAnalysisNoteRepository;
import com.example.threadbench.domain.benchmark.repository.ExperimentConfigRepository;
import com.example.threadbench.domain.benchmark.repository.MetricSnapshotRepository;
import com.example.threadbench.global.exception.InvalidRequestException;
import com.example.threadbench.global.exception.ResourceNotFoundException;
import com.example.threadbench.global.properties.AppProperties;
import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BenchmarkRunService {

    private final BenchmarkRunRepository benchmarkRunRepository;
    private final BenchmarkLayerMetricRepository benchmarkLayerMetricRepository;
    private final ExperimentConfigRepository experimentConfigRepository;
    private final MetricSnapshotRepository metricSnapshotRepository;
    private final BenchmarkSummaryRepository benchmarkSummaryRepository;
    private final BottleneckAnalysisNoteRepository bottleneckAnalysisNoteRepository;
    private final BenchmarkExecutionService benchmarkExecutionService;
    private final AppProperties appProperties;
    private final BenchmarkExecutionProperties executionProperties;
    private final BenchmarkRunMapper benchmarkRunMapper;
    private final DataSource dataSource;

    @Transactional
    public BenchmarkRunSummaryResponse createRun(BenchmarkRunRequest request) {
        BenchmarkScenario scenario = request.scenario();
        long sampleId = request.sampleId() == null ? 1L : request.sampleId();
        int delayMs = request.delayMs() == null ? appProperties.getDefaultExternalDelayMs() : request.delayMs();
        int externalStatus = request.externalStatus() == null ? 200 : request.externalStatus();
        int dbHoldMs = request.dbHoldMs() == null ? executionProperties.getDefaultDbHoldMs() : request.dbHoldMs();
        int threadCount = request.threadCount() == null ? executionProperties.getDefaultThreadCount() : request.threadCount();
        int rampUpSeconds = request.rampUpSeconds() == null ? executionProperties.getDefaultRampUpSeconds() : request.rampUpSeconds();
        int durationSeconds = request.durationSeconds() == null ? executionProperties.getDefaultDurationSeconds() : request.durationSeconds();
        int loopCount = request.loopCount() == null ? executionProperties.getDefaultLoopCount() : request.loopCount();
        int connectionPoolSize = resolveConnectionPoolSize();

        validateRequest(scenario, durationSeconds, threadCount, loopCount, dbHoldMs);

        BenchmarkRun run = new BenchmarkRun();
        run.setCorrelationId(UUID.randomUUID().toString());
        run.setMode(appProperties.getMode());
        run.setScenario(scenario.name());
        run.setRequestPath(scenario.requestPath(sampleId, delayMs, externalStatus, dbHoldMs));
        run.setSampleId(scenario.requiresSampleId() ? sampleId : null);
        run.setExternalDelayMs(scenario.usesExternalApi() ? delayMs : null);
        run.setExternalStatus(scenario.supportsExternalStatus() ? externalStatus : null);
        run.setDbHoldMs(scenario.supportsDbHoldMs() ? dbHoldMs : null);
        run.setThreadCount(threadCount);
        run.setRampUpSeconds(rampUpSeconds);
        run.setDurationSeconds(durationSeconds);
        run.setLoopCount(loopCount);
        run.setConnectionPoolSize(connectionPoolSize);
        run.setStatus(BenchmarkRunStatus.QUEUED.name());

        BenchmarkRun savedRun = benchmarkRunRepository.saveAndFlush(run);
        experimentConfigRepository.save(toExperimentConfig(savedRun));
        benchmarkExecutionService.enqueue(savedRun.getId());
        return benchmarkRunMapper.toSummary(savedRun);
    }

    @Transactional(readOnly = true)
    public List<BenchmarkRunSummaryResponse> findRuns() {
        return benchmarkRunRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(benchmarkRunMapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public BenchmarkRunDetailResponse getRun(Long runId) {
        BenchmarkRun run = benchmarkRunRepository.findById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Benchmark run not found: " + runId));

        ExperimentConfig experimentConfig = experimentConfigRepository.findByBenchmarkRun_Id(runId).orElse(null);
        BenchmarkSummary benchmarkSummary = benchmarkSummaryRepository.findByBenchmarkRun_Id(runId).orElse(null);
        List<MetricSnapshot> metricSnapshots = metricSnapshotRepository.findByBenchmarkRun_IdOrderByRecordedAtAsc(runId);
        List<BottleneckAnalysisNote> bottleneckNotes =
                bottleneckAnalysisNoteRepository.findByBenchmarkRun_IdOrderByCreatedAtAsc(runId);

        return benchmarkRunMapper.toDetail(
                run,
                experimentConfig,
                benchmarkSummary,
                metricSnapshots,
                bottleneckNotes,
                benchmarkLayerMetricRepository.findByBenchmarkRun_IdOrderByLayerAsc(runId)
        );
    }

    @Transactional(readOnly = true)
    public BenchmarkRunExportResponse exportRun(Long runId) {
        return new BenchmarkRunExportResponse(getRun(runId));
    }

    public BenchmarkOptionsResponse getOptions() {
        return new BenchmarkOptionsResponse(
                appProperties.getMode(),
                appProperties.getDefaultExternalDelayMs(),
                executionProperties.getDefaultDbHoldMs(),
                executionProperties.getDefaultThreadCount(),
                executionProperties.getDefaultRampUpSeconds(),
                executionProperties.getDefaultDurationSeconds(),
                executionProperties.getDefaultLoopCount(),
                Arrays.asList(BenchmarkScenario.values())
        );
    }

    private ExperimentConfig toExperimentConfig(BenchmarkRun run) {
        ExperimentConfig config = new ExperimentConfig();
        config.setBenchmarkRun(run);
        config.setThreadMode(run.getMode());
        config.setScenarioCode(run.getScenario());
        config.setRequestPath(run.getRequestPath());
        config.setSampleId(run.getSampleId());
        config.setExternalDelayMs(run.getExternalDelayMs());
        config.setExternalStatus(run.getExternalStatus());
        config.setDbHoldMs(run.getDbHoldMs());
        config.setThreadCount(run.getThreadCount());
        config.setRampUpSeconds(run.getRampUpSeconds());
        config.setDurationSeconds(run.getDurationSeconds());
        config.setLoopCount(run.getLoopCount());
        config.setConnectionPoolSize(run.getConnectionPoolSize());
        return config;
    }

    private int resolveConnectionPoolSize() {
        if (dataSource instanceof HikariDataSource hikariDataSource) {
            return hikariDataSource.getMaximumPoolSize();
        }
        return 0;
    }

    private static void validateRequest(
            BenchmarkScenario scenario,
            int durationSeconds,
            int threadCount,
            int loopCount,
            int dbHoldMs
    ) {
        if (durationSeconds <= 0) {
            throw new InvalidRequestException("durationSeconds must be positive");
        }
        if (threadCount <= 0) {
            throw new InvalidRequestException("threadCount must be positive");
        }
        if (loopCount <= 0) {
            throw new InvalidRequestException("loopCount must be positive");
        }
        if (dbHoldMs < 0) {
            throw new InvalidRequestException("dbHoldMs must be zero or positive");
        }
    }
}
