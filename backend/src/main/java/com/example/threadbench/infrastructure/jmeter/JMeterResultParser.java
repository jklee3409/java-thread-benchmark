package com.example.threadbench.infrastructure.jmeter;

import com.example.threadbench.infrastructure.jmeter.model.JMeterRunSummary;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JMeterResultParser {

    public JMeterRunSummary parse(Path resultFile, Instant startedAt, Instant completedAt) throws IOException {
        if (!Files.exists(resultFile)) {
            return JMeterRunSummary.empty();
        }

        List<String> lines = Files.readAllLines(resultFile, StandardCharsets.UTF_8);
        if (lines.size() <= 1) {
            return JMeterRunSummary.empty();
        }

        Map<String, Integer> indexes = indexes(lines.get(0));
        int elapsedIndex = indexes.getOrDefault("elapsed", 1);
        int timestampIndex = indexes.getOrDefault("timeStamp", 0);
        int successIndex = indexes.getOrDefault("success", 3);

        List<Long> latencies = new ArrayList<>();
        int totalSamples = 0;
        int successSamples = 0;
        int errorSamples = 0;
        long minTimestamp = Long.MAX_VALUE;
        long maxTimestamp = Long.MIN_VALUE;
        long totalLatency = 0L;

        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line == null || line.isBlank()) {
                continue;
            }
            String[] columns = line.split(",", -1);
            long elapsed = longValue(columns, elapsedIndex);
            long timestamp = longValue(columns, timestampIndex);
            boolean success = booleanValue(columns, successIndex);

            totalSamples++;
            totalLatency += elapsed;
            latencies.add(elapsed);
            if (success) {
                successSamples++;
            } else {
                errorSamples++;
            }
            minTimestamp = Math.min(minTimestamp, timestamp);
            maxTimestamp = Math.max(maxTimestamp, timestamp);
        }

        if (totalSamples == 0) {
            return JMeterRunSummary.empty();
        }

        latencies.sort(Long::compareTo);
        double averageLatencyMs = totalLatency / (double) totalSamples;
        double p95LatencyMs = latencies.get(Math.max((int) Math.ceil(totalSamples * 0.95) - 1, 0));
        double p99LatencyMs = latencies.get(Math.max((int) Math.ceil(totalSamples * 0.99) - 1, 0));
        double errorRate = (errorSamples * 100.0) / totalSamples;

        double elapsedSeconds = 0.0;
        if (minTimestamp != Long.MAX_VALUE && maxTimestamp != Long.MIN_VALUE && maxTimestamp > minTimestamp) {
            elapsedSeconds = (maxTimestamp - minTimestamp) / 1000.0;
        } else if (startedAt != null && completedAt != null && completedAt.isAfter(startedAt)) {
            elapsedSeconds = (completedAt.toEpochMilli() - startedAt.toEpochMilli()) / 1000.0;
        }
        double throughput = elapsedSeconds <= 0.0 ? totalSamples : totalSamples / elapsedSeconds;

        return new JMeterRunSummary(
                totalSamples,
                successSamples,
                errorSamples,
                averageLatencyMs,
                p95LatencyMs,
                p99LatencyMs,
                errorRate,
                throughput
        );
    }

    private static Map<String, Integer> indexes(String header) {
        String[] names = header.split(",", -1);
        Map<String, Integer> indexes = new HashMap<>();
        for (int i = 0; i < names.length; i++) {
            indexes.put(names[i], i);
        }
        return indexes;
    }

    private static long longValue(String[] columns, int index) {
        if (index < 0 || index >= columns.length || columns[index].isBlank()) {
            return 0L;
        }
        return Long.parseLong(columns[index]);
    }

    private static boolean booleanValue(String[] columns, int index) {
        return index >= 0 && index < columns.length && Boolean.parseBoolean(columns[index]);
    }
}
