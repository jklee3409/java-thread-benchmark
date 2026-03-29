package com.example.threadbench.domain.workload.controller;

import com.example.threadbench.domain.workload.dto.WorkloadResponse;
import com.example.threadbench.domain.workload.service.WorkloadService;
import com.example.threadbench.global.properties.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workloads")
@RequiredArgsConstructor
public class WorkloadController {

    private final WorkloadService workloadService;
    private final AppProperties appProperties;

    @GetMapping("/cache-hit/{id}")
    public WorkloadResponse cacheHit(
            @PathVariable long id,
            @RequestHeader(name = "X-Benchmark-Run-Id", required = false) String runId
    ) {
        return workloadService.cacheHit(id, runId);
    }

    @GetMapping("/db-read/{id}")
    public WorkloadResponse dbRead(
            @PathVariable long id,
            @RequestHeader(name = "X-Benchmark-Run-Id", required = false) String runId
    ) {
        return workloadService.dbRead(id, runId);
    }

    @GetMapping("/external")
    public WorkloadResponse external(
            @RequestHeader(name = "X-Benchmark-Run-Id", required = false) String runId,
            @RequestParam(required = false) Integer delayMs,
            @RequestParam(defaultValue = "200") int status
    ) {
        int effectiveDelayMs = delayMs == null ? appProperties.getDefaultExternalDelayMs() : delayMs;
        return workloadService.external(effectiveDelayMs, status, runId);
    }

    @GetMapping("/mixed/{id}")
    public WorkloadResponse mixed(
            @PathVariable long id,
            @RequestHeader(name = "X-Benchmark-Run-Id", required = false) String runId,
            @RequestParam(required = false) Integer delayMs
    ) {
        int effectiveDelayMs = delayMs == null ? appProperties.getDefaultExternalDelayMs() : delayMs;
        return workloadService.mixed(id, effectiveDelayMs, runId);
    }

    @GetMapping("/contention-heavy/{id}")
    public WorkloadResponse contentionHeavy(
            @PathVariable long id,
            @RequestHeader(name = "X-Benchmark-Run-Id", required = false) String runId,
            @RequestParam(required = false) Integer delayMs,
            @RequestParam(required = false) Integer dbHoldMs
    ) {
        int effectiveDelayMs = delayMs == null ? appProperties.getDefaultExternalDelayMs() : delayMs;
        int effectiveDbHoldMs = dbHoldMs == null ? 150 : dbHoldMs;
        return workloadService.contentionHeavy(id, effectiveDelayMs, effectiveDbHoldMs, runId);
    }
}
