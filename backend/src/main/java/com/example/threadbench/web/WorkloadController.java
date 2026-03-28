package com.example.threadbench.web;

import com.example.threadbench.config.AppProperties;
import com.example.threadbench.dto.WorkloadResponse;
import com.example.threadbench.service.WorkloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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
    public WorkloadResponse cacheHit(@PathVariable long id) {
        return workloadService.cacheHit(id);
    }

    @GetMapping("/db-read/{id}")
    public WorkloadResponse dbRead(@PathVariable long id) {
        return workloadService.dbRead(id);
    }

    @GetMapping("/external")
    public WorkloadResponse external(
            @RequestParam(required = false) Integer delayMs,
            @RequestParam(defaultValue = "200") int status
    ) {
        int effectiveDelayMs = delayMs == null ? appProperties.getDefaultExternalDelayMs() : delayMs;
        return workloadService.external(effectiveDelayMs, status);
    }

    @GetMapping("/mixed/{id}")
    public WorkloadResponse mixed(
            @PathVariable long id,
            @RequestParam(required = false) Integer delayMs
    ) {
        int effectiveDelayMs = delayMs == null ? appProperties.getDefaultExternalDelayMs() : delayMs;
        return workloadService.mixed(id, effectiveDelayMs);
    }
}
