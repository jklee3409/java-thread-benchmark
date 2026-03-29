package com.example.threadbench.domain.benchmark.mapper;

import com.example.threadbench.domain.benchmark.dto.BenchmarkLayerMetricResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunDetailResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunSummaryResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkSummaryResponse;
import com.example.threadbench.domain.benchmark.dto.BottleneckAnalysisNoteResponse;
import com.example.threadbench.domain.benchmark.dto.ExperimentConfigResponse;
import com.example.threadbench.domain.benchmark.dto.MetricSnapshotResponse;
import com.example.threadbench.domain.benchmark.entity.BenchmarkSummary;
import com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric;
import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.entity.BottleneckAnalysisNote;
import com.example.threadbench.domain.benchmark.entity.ExperimentConfig;
import com.example.threadbench.domain.benchmark.entity.MetricSnapshot;
import com.example.threadbench.domain.benchmark.model.BenchmarkLayer;
import com.example.threadbench.domain.benchmark.model.BenchmarkRunStatus;
import com.example.threadbench.domain.benchmark.model.BenchmarkScenario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BenchmarkRunMapper {

    public BenchmarkRunSummaryResponse toSummary(BenchmarkRun run) {
        return new BenchmarkRunSummaryResponse(
                run.getId(),
                run.getMode(),
                BenchmarkScenario.valueOf(run.getScenario()),
                BenchmarkRunStatus.valueOf(run.getStatus()),
                run.getThreadCount(),
                run.getDurationSeconds(),
                run.getTotalSamples(),
                run.getErrorSamples(),
                run.getThroughput(),
                run.getP95LatencyMs(),
                run.getP99LatencyMs(),
                run.getErrorRate(),
                run.getCreatedAt(),
                run.getStartedAt(),
                run.getCompletedAt()
        );
    }

    public BenchmarkRunDetailResponse toDetail(
            BenchmarkRun run,
            ExperimentConfig experimentConfig,
            BenchmarkSummary benchmarkSummary,
            List<MetricSnapshot> metricSnapshots,
            List<BottleneckAnalysisNote> bottleneckNotes,
            List<BenchmarkLayerMetric> metrics
    ) {
        return new BenchmarkRunDetailResponse(
                run.getId(),
                run.getCorrelationId(),
                run.getMode(),
                BenchmarkScenario.valueOf(run.getScenario()),
                BenchmarkRunStatus.valueOf(run.getStatus()),
                run.getRequestPath(),
                run.getSampleId(),
                run.getExternalDelayMs(),
                run.getExternalStatus(),
                run.getDbHoldMs(),
                run.getThreadCount(),
                run.getRampUpSeconds(),
                run.getDurationSeconds(),
                run.getLoopCount(),
                run.getConnectionPoolSize(),
                run.getTotalSamples(),
                run.getSuccessSamples(),
                run.getErrorSamples(),
                run.getAverageLatencyMs(),
                run.getP95LatencyMs(),
                run.getP99LatencyMs(),
                run.getThroughput(),
                run.getErrorRate(),
                run.getFailureMessage(),
                run.getResultFilePath(),
                run.getJmeterLogPath(),
                run.getProcessOutputPath(),
                run.getCreatedAt(),
                run.getStartedAt(),
                run.getCompletedAt(),
                toExperimentConfig(experimentConfig),
                toBenchmarkSummary(benchmarkSummary),
                metricSnapshots.stream()
                        .map(this::toMetricSnapshot)
                        .toList(),
                bottleneckNotes.stream()
                        .map(this::toBottleneckNote)
                        .toList(),
                metrics.stream()
                        .map(this::toLayerMetric)
                        .toList()
        );
    }

    private BenchmarkLayerMetricResponse toLayerMetric(BenchmarkLayerMetric metric) {
        return new BenchmarkLayerMetricResponse(
                BenchmarkLayer.valueOf(metric.getLayer()).value(),
                metric.getInvocationCount(),
                metric.getErrorCount(),
                metric.getTimeoutCount(),
                metric.getAverageLatencyMs(),
                metric.getP95LatencyMs(),
                metric.getP99LatencyMs(),
                metric.getMaxLatencyMs()
        );
    }

    private ExperimentConfigResponse toExperimentConfig(ExperimentConfig experimentConfig) {
        if (experimentConfig == null) {
            return null;
        }

        return new ExperimentConfigResponse(
                experimentConfig.getThreadMode(),
                BenchmarkScenario.valueOf(experimentConfig.getScenarioCode()),
                experimentConfig.getRequestPath(),
                experimentConfig.getSampleId(),
                experimentConfig.getExternalDelayMs(),
                experimentConfig.getExternalStatus(),
                experimentConfig.getDbHoldMs(),
                experimentConfig.getThreadCount(),
                experimentConfig.getRampUpSeconds(),
                experimentConfig.getDurationSeconds(),
                experimentConfig.getLoopCount(),
                experimentConfig.getConnectionPoolSize(),
                experimentConfig.getCreatedAt()
        );
    }

    private BenchmarkSummaryResponse toBenchmarkSummary(BenchmarkSummary benchmarkSummary) {
        if (benchmarkSummary == null) {
            return null;
        }

        return new BenchmarkSummaryResponse(
                benchmarkSummary.getErrorRate(),
                benchmarkSummary.getP99LatencyMs(),
                benchmarkSummary.getBottleneckLayer(),
                benchmarkSummary.getSummaryText(),
                benchmarkSummary.getRecommendationText(),
                benchmarkSummary.getCreatedAt()
        );
    }

    private MetricSnapshotResponse toMetricSnapshot(MetricSnapshot metricSnapshot) {
        return new MetricSnapshotResponse(
                metricSnapshot.getSnapshotType(),
                metricSnapshot.getRecordedAt(),
                metricSnapshot.getActiveConnections(),
                metricSnapshot.getIdleConnections(),
                metricSnapshot.getPendingConnections(),
                metricSnapshot.getTotalConnections(),
                metricSnapshot.getLiveThreads(),
                metricSnapshot.getDaemonThreads(),
                metricSnapshot.getPeakThreads(),
                metricSnapshot.getTotalStartedThreads(),
                metricSnapshot.getPayloadJson()
        );
    }

    private BottleneckAnalysisNoteResponse toBottleneckNote(BottleneckAnalysisNote note) {
        return new BottleneckAnalysisNoteResponse(
                note.getSeverity(),
                note.getLayer(),
                note.getMessage(),
                note.getCreatedAt()
        );
    }
}
