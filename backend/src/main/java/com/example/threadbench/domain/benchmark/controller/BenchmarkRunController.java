package com.example.threadbench.domain.benchmark.controller;

import com.example.threadbench.domain.benchmark.dto.BenchmarkOptionsResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunDetailResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunExportResponse;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunRequest;
import com.example.threadbench.domain.benchmark.dto.BenchmarkRunSummaryResponse;
import com.example.threadbench.domain.benchmark.service.BenchmarkRunService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/benchmarks")
@RequiredArgsConstructor
public class BenchmarkRunController {

    private final BenchmarkRunService benchmarkRunService;

    @GetMapping("/options")
    public BenchmarkOptionsResponse options() {
        return benchmarkRunService.getOptions();
    }

    @PostMapping("/runs")
    public BenchmarkRunSummaryResponse createRun(@Valid @RequestBody BenchmarkRunRequest request) {
        return benchmarkRunService.createRun(request);
    }

    @GetMapping("/runs")
    public List<BenchmarkRunSummaryResponse> runs() {
        return benchmarkRunService.findRuns();
    }

    @GetMapping("/runs/{runId}")
    public BenchmarkRunDetailResponse run(@PathVariable Long runId) {
        return benchmarkRunService.getRun(runId);
    }

    @GetMapping("/runs/{runId}/export")
    public BenchmarkRunExportResponse export(@PathVariable Long runId) {
        return benchmarkRunService.exportRun(runId);
    }
}
