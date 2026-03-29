package com.example.threadbench.infrastructure.jmeter;

import com.example.threadbench.infrastructure.jmeter.model.JMeterRunSummary;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JMeterResultParserTest {

    private final JMeterResultParser parser = new JMeterResultParser();

    @Test
    void parsesPercentilesErrorRateAndThroughput(@TempDir Path tempDir) throws Exception {
        Path resultFile = tempDir.resolve("results.csv");
        Files.writeString(resultFile, """
                timeStamp,elapsed,label,success
                1000,100,request,true
                2000,200,request,true
                3000,300,request,false
                4000,400,request,true
                """);

        JMeterRunSummary summary = parser.parse(
                resultFile,
                Instant.ofEpochMilli(1000),
                Instant.ofEpochMilli(5000)
        );

        assertEquals(4, summary.totalSamples());
        assertEquals(3, summary.successSamples());
        assertEquals(1, summary.errorSamples());
        assertEquals(250.0, summary.averageLatencyMs());
        assertEquals(400.0, summary.p95LatencyMs());
        assertEquals(400.0, summary.p99LatencyMs());
        assertEquals(25.0, summary.errorRate());
        assertEquals(4.0 / 3.0, summary.throughput(), 0.0001);
    }
}
