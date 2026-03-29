package com.example.threadbench.infrastructure.jmeter;

import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.global.properties.BenchmarkExecutionProperties;
import com.example.threadbench.infrastructure.jmeter.model.BenchmarkExecutionPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JMeterCommandBuilder {

    private final BenchmarkExecutionProperties properties;
    private final JMeterTestPlanWriter testPlanWriter;

    @Value("${server.port:8080}")
    private int serverPort;

    public BenchmarkExecutionPlan prepare(BenchmarkRun run) throws IOException {
        Path runDirectory = resolveRunDirectory(run.getId());
        Path testPlanPath = resolveTestPlan(runDirectory);
        Path resultsFile = runDirectory.resolve("results.csv");
        Path jmeterLogFile = runDirectory.resolve("jmeter.log");
        Path processOutputFile = runDirectory.resolve("process-output.log");

        URI baseUri = resolveBaseUri();
        int port = baseUri.getPort() > 0 ? baseUri.getPort() : defaultPort(baseUri.getScheme());

        List<String> command = new ArrayList<>();
        command.add(properties.getJmeterExecutable());
        command.add("-n");
        command.add("-t");
        command.add(testPlanPath.toString());
        command.add("-l");
        command.add(resultsFile.toString());
        command.add("-j");
        command.add(jmeterLogFile.toString());
        command.add("-Jprotocol=" + baseUri.getScheme());
        command.add("-Jhost=" + baseUri.getHost());
        command.add("-Jport=" + port);
        command.add("-JrequestPath=" + run.getRequestPath());
        command.add("-JrunId=" + run.getCorrelationId());
        command.add("-JnumThreads=" + run.getThreadCount());
        command.add("-JrampUpSeconds=" + run.getRampUpSeconds());
        command.add("-JdurationSeconds=" + run.getDurationSeconds());
        command.add("-JloopCount=" + run.getLoopCount());

        return new BenchmarkExecutionPlan(command, runDirectory, resultsFile, jmeterLogFile, processOutputFile);
    }

    private Path resolveRunDirectory(Long runId) throws IOException {
        Path baseDirectory = Paths.get(properties.getResultsDir()).toAbsolutePath().normalize();
        Files.createDirectories(baseDirectory);

        Path runDirectory = baseDirectory.resolve("run-" + runId);
        Files.createDirectories(runDirectory);
        return runDirectory;
    }

    private Path resolveTestPlan(Path runDirectory) throws IOException {
        if (properties.getTestPlanPath() != null && !properties.getTestPlanPath().isBlank()) {
            return Paths.get(properties.getTestPlanPath()).toAbsolutePath().normalize();
        }
        return testPlanWriter.write(runDirectory.resolve("thread-benchmark.jmx"));
    }

    private URI resolveBaseUri() {
        String configuredBaseUrl = properties.getBaseUrl();
        if (configuredBaseUrl == null || configuredBaseUrl.isBlank()) {
            configuredBaseUrl = "http://localhost:" + serverPort;
        }
        return URI.create(configuredBaseUrl);
    }

    private static int defaultPort(String scheme) {
        return "https".equalsIgnoreCase(scheme) ? 443 : 80;
    }
}
