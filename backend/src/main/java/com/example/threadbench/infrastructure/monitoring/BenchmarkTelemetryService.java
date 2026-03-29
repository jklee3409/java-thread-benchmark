package com.example.threadbench.infrastructure.monitoring;

import com.example.threadbench.domain.benchmark.entity.BenchmarkLayerMetric;
import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.domain.benchmark.model.BenchmarkLayer;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;

@Service
@RequiredArgsConstructor
public class BenchmarkTelemetryService {

    private final MeterRegistry meterRegistry;

    private final ConcurrentMap<String, ConcurrentMap<BenchmarkLayer, LayerAccumulator>> accumulators = new ConcurrentHashMap<>();

    public void initializeRun(String correlationId) {
        accumulators.computeIfAbsent(correlationId, ignored -> new ConcurrentHashMap<>());
    }

    public void record(String correlationId, BenchmarkLayer layer, long durationNanos, boolean success, Throwable failure) {
        if (correlationId == null || correlationId.isBlank()) {
            return;
        }

        boolean timeout = isTimeout(failure);
        ConcurrentMap<BenchmarkLayer, LayerAccumulator> layerAccumulators =
                accumulators.computeIfAbsent(correlationId, ignored -> new ConcurrentHashMap<>());
        LayerAccumulator accumulator = layerAccumulators.computeIfAbsent(layer, ignored -> new LayerAccumulator());
        accumulator.record(durationNanos, success, timeout);
        incrementCounter("benchmark.layer.invocations", layer);
        if (!success) {
            incrementCounter("benchmark.layer.errors", layer);
        }
        if (timeout) {
            incrementCounter("benchmark.layer.timeouts", layer);
        }
    }

    public List<BenchmarkLayerMetric> drain(BenchmarkRun benchmarkRun) {
        Map<BenchmarkLayer, LayerAccumulator> layerAccumulators = accumulators.remove(benchmarkRun.getCorrelationId());
        if (layerAccumulators == null || layerAccumulators.isEmpty()) {
            return List.of();
        }

        List<BenchmarkLayerMetric> metrics = new ArrayList<>();
        layerAccumulators.entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getKey().name()))
                .forEach(entry -> metrics.add(entry.getValue().toEntity(benchmarkRun, entry.getKey())));
        return metrics;
    }

    public void discard(String correlationId) {
        if (correlationId != null) {
            accumulators.remove(correlationId);
        }
    }

    private void incrementCounter(String meterName, BenchmarkLayer layer) {
        Counter.builder(meterName)
                .tag("layer", layer.value())
                .register(meterRegistry)
                .increment();
    }

    private static boolean isTimeout(Throwable failure) {
        if (failure == null) {
            return false;
        }
        Throwable current = failure;
        while (current != null) {
            if (current instanceof SocketTimeoutException) {
                return true;
            }
            if (current instanceof ResourceAccessException
                    && current.getMessage() != null
                    && current.getMessage().toLowerCase().contains("timed out")) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private static final class LayerAccumulator {
        private final LongAdder invocationCount = new LongAdder();
        private final LongAdder errorCount = new LongAdder();
        private final LongAdder timeoutCount = new LongAdder();
        private final LongAdder totalLatencyNanos = new LongAdder();
        private final AtomicLong maxLatencyNanos = new AtomicLong();
        private final ConcurrentLinkedQueue<Long> latencyNanos = new ConcurrentLinkedQueue<>();

        void record(long durationNanos, boolean success, boolean timeout) {
            invocationCount.increment();
            if (!success) {
                errorCount.increment();
            }
            if (timeout) {
                timeoutCount.increment();
            }
            totalLatencyNanos.add(durationNanos);
            latencyNanos.add(durationNanos);
            maxLatencyNanos.accumulateAndGet(durationNanos, Math::max);
        }

        BenchmarkLayerMetric toEntity(BenchmarkRun benchmarkRun, BenchmarkLayer layer) {
            List<Long> orderedLatencies = new ArrayList<>(latencyNanos);
            orderedLatencies.sort(Long::compareTo);

            long count = invocationCount.sum();
            double averageLatencyMs = count == 0 ? 0.0 : nanosToMillis(totalLatencyNanos.sum() / (double) count);
            double p95LatencyMs = orderedLatencies.isEmpty() ? 0.0
                    : nanosToMillis(percentile(orderedLatencies, 0.95));
            double p99LatencyMs = orderedLatencies.isEmpty() ? 0.0
                    : nanosToMillis(percentile(orderedLatencies, 0.99));

            BenchmarkLayerMetric metric = new BenchmarkLayerMetric();
            metric.setBenchmarkRun(benchmarkRun);
            metric.setLayer(layer.name());
            metric.setInvocationCount(count);
            metric.setErrorCount(errorCount.sum());
            metric.setTimeoutCount(timeoutCount.sum());
            metric.setAverageLatencyMs(averageLatencyMs);
            metric.setP95LatencyMs(p95LatencyMs);
            metric.setP99LatencyMs(p99LatencyMs);
            metric.setMaxLatencyMs(nanosToMillis(maxLatencyNanos.get()));
            return metric;
        }

        private static long percentile(List<Long> sortedValues, double percentile) {
            int index = (int) Math.ceil(percentile * sortedValues.size()) - 1;
            return sortedValues.get(Math.max(index, 0));
        }

        private static double nanosToMillis(double nanos) {
            return nanos / 1_000_000.0;
        }
    }
}
