package com.example.threadbench.domain.benchmark.service;

import com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric;
import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.entity.BenchmarkSummary;
import com.example.threadbench.domain.benchmark.entity.BottleneckAnalysisNote;
import com.example.threadbench.domain.benchmark.entity.MetricSnapshot;
import com.example.threadbench.domain.benchmark.model.BenchmarkLayer;
import com.example.threadbench.domain.benchmark.repository.BenchmarkSummaryRepository;
import com.example.threadbench.domain.benchmark.repository.BottleneckAnalysisNoteRepository;
import com.example.threadbench.domain.benchmark.repository.MetricSnapshotRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BenchmarkInsightService {

    private final BenchmarkSummaryRepository benchmarkSummaryRepository;
    private final BottleneckAnalysisNoteRepository bottleneckAnalysisNoteRepository;
    private final MetricSnapshotRepository metricSnapshotRepository;
    private final EntityManager entityManager;

    @Transactional
    public void publish(BenchmarkRun run, List<BenchmarkLayerMetric> layerMetrics) {
        List<MetricSnapshot> snapshots = metricSnapshotRepository.findByBenchmarkRun_IdOrderByRecordedAtAsc(run.getId());
        int maxPendingConnections = snapshots.stream()
                .mapToInt(MetricSnapshot::getPendingConnections)
                .max()
                .orElse(0);

        BenchmarkLayerMetric bottleneckMetric = layerMetrics.stream()
                .filter(metric -> !"OVERALL".equals(metric.getLayer()))
                .max(Comparator.comparingDouble(BenchmarkLayerMetric::getP99LatencyMs)
                        .thenComparingDouble(BenchmarkLayerMetric::getP95LatencyMs)
                        .thenComparingLong(BenchmarkLayerMetric::getInvocationCount))
                .orElse(null);

        String bottleneckLayer = bottleneckMetric == null
                ? null
                : BenchmarkLayer.valueOf(bottleneckMetric.getLayer()).value();

        BenchmarkSummary summary = benchmarkSummaryRepository.findByBenchmarkRun_Id(run.getId())
                .orElseGet(BenchmarkSummary::new);
        summary.setBenchmarkRun(entityManager.getReference(BenchmarkRun.class, run.getId()));
        summary.setErrorRate(run.getErrorRate());
        summary.setP99LatencyMs(run.getP99LatencyMs());
        summary.setBottleneckLayer(bottleneckLayer);
        summary.setSummaryText(buildSummaryText(run, bottleneckLayer, maxPendingConnections));
        summary.setRecommendationText(buildRecommendationText(bottleneckLayer, maxPendingConnections, run));
        benchmarkSummaryRepository.save(summary);

        bottleneckAnalysisNoteRepository.deleteByBenchmarkRun_Id(run.getId());
        List<BottleneckAnalysisNote> notes = buildNotes(run, bottleneckMetric, maxPendingConnections);
        if (!notes.isEmpty()) {
            bottleneckAnalysisNoteRepository.saveAll(notes);
        }
    }

    private String buildSummaryText(BenchmarkRun run, String bottleneckLayer, int maxPendingConnections) {
        String bottleneckLabel = bottleneckLayer == null ? "undetermined" : bottleneckLayer;
        return "Run %d completed in %s mode for scenario %s with throughput %.2f req/s, p95 %.2f ms, p99 %.2f ms, error rate %.2f%%. "
                .formatted(
                        run.getId(),
                        run.getMode(),
                        run.getScenario(),
                        run.getThroughput(),
                        run.getP95LatencyMs(),
                        run.getP99LatencyMs(),
                        run.getErrorRate()
                )
                + "Primary bottleneck layer is %s. Peak pending DB connections: %d."
                .formatted(bottleneckLabel, maxPendingConnections);
    }

    private String buildRecommendationText(String bottleneckLayer, int maxPendingConnections, BenchmarkRun run) {
        List<String> recommendations = new ArrayList<>();

        if (maxPendingConnections > 0) {
            recommendations.add("DB pool contention was observed; either lower concurrency, shorten DB hold time, or raise Hikari max pool size beyond %d.".formatted(run.getConnectionPoolSize()));
        }

        if (bottleneckLayer == null) {
            recommendations.add("Collect a longer run or inspect snapshots because no dominant application layer was detected.");
        } else {
            switch (BenchmarkLayer.valueOf(bottleneckLayer.toUpperCase(Locale.ROOT))) {
                case DB -> recommendations.add("Optimize the DB path first: reduce blocking query time, validate indexes, and compare the same run against a larger pool size.");
                case REDIS -> recommendations.add("Redis dominates latency; reduce chatty access, validate key TTL/hit ratio, and consider request-local batching.");
                case EXTERNAL -> recommendations.add("External I/O dominates; tighten timeouts, add bulkheads, and compare with a lower simulated delay to isolate scheduler effects.");
                case OVERALL -> recommendations.add("Application overhead dominates; inspect thread dumps/JFR and compare servlet/request saturation against executor and container limits.");
            }
        }

        if (run.getErrorRate() > 0.0) {
            recommendations.add("Investigate non-zero errors before comparing VT/PT throughput because retries and failures skew fairness.");
        }

        return String.join(" ", recommendations);
    }

    private List<BottleneckAnalysisNote> buildNotes(
            BenchmarkRun run,
            BenchmarkLayerMetric bottleneckMetric,
            int maxPendingConnections
    ) {
        List<BottleneckAnalysisNote> notes = new ArrayList<>();

        if (maxPendingConnections > 0) {
            notes.add(note(run, "HIGH", "db",
                    "Observed pending DB connections up to %d while pool size was %d."
                            .formatted(maxPendingConnections, run.getConnectionPoolSize())));
        }

        Optional.ofNullable(bottleneckMetric)
                .filter(metric -> metric.getTimeoutCount() > 0)
                .ifPresent(metric -> notes.add(note(
                        run,
                        "HIGH",
                        BenchmarkLayer.valueOf(metric.getLayer()).value(),
                        "Layer %s recorded %d timeout events."
                                .formatted(BenchmarkLayer.valueOf(metric.getLayer()).value(), metric.getTimeoutCount())
                )));

        if (run.getErrorRate() > 1.0) {
            notes.add(note(run, "MEDIUM", null,
                    "Run error rate reached %.2f%%, so result interpretation requires checking failed samples and JMeter logs."
                            .formatted(run.getErrorRate())));
        }

        Optional.ofNullable(bottleneckMetric)
                .ifPresent(metric -> notes.add(note(
                        run,
                        "INFO",
                        BenchmarkLayer.valueOf(metric.getLayer()).value(),
                        "Highest layer latency came from %s with p95 %.2f ms and p99 %.2f ms."
                                .formatted(
                                        BenchmarkLayer.valueOf(metric.getLayer()).value(),
                                        metric.getP95LatencyMs(),
                                        metric.getP99LatencyMs()
                                )
                )));

        return notes;
    }

    private BottleneckAnalysisNote note(BenchmarkRun run, String severity, String layer, String message) {
        BottleneckAnalysisNote note = new BottleneckAnalysisNote();
        note.setBenchmarkRun(entityManager.getReference(BenchmarkRun.class, run.getId()));
        note.setSeverity(severity);
        note.setLayer(layer);
        note.setMessage(message);
        return note;
    }
}
