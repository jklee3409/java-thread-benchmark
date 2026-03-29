package com.example.threadbench.infrastructure.jmeter.model;

import java.nio.file.Path;
import java.util.List;

public record BenchmarkExecutionPlan(
        List<String> command,
        Path runDirectory,
        Path resultsFile,
        Path jmeterLogFile,
        Path processOutputFile
) {
}
