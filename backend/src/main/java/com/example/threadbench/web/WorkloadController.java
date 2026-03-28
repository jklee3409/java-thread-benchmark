package com.example.threadbench.web;

import com.example.threadbench.dto.WorkloadResponse;
import com.example.threadbench.service.WorkloadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workloads")
public class WorkloadController {

    private final WorkloadService workloadService;

    public WorkloadController(WorkloadService workloadService) {
        this.workloadService = workloadService;
    }

    @GetMapping("/cache-hit/{key}")
    public WorkloadResponse cacheHit(@PathVariable String key) {
        return workloadService.cacheHit(key);
    }

    @GetMapping("/db-read/{id}")
    public WorkloadResponse dbRead(@PathVariable long id) {
        return workloadService.dbRead(id);
    }

    @GetMapping("/external")
    public WorkloadResponse external(
            @RequestParam(defaultValue = "100") int delayMs,
            @RequestParam(defaultValue = "200") int status
    ) {
        return workloadService.external(delayMs, status);
    }

    @GetMapping("/mixed/{id}")
    public WorkloadResponse mixed(
            @PathVariable long id,
            @RequestParam(required = false) Integer delayMs
    ) {
        return workloadService.mixed(id, delayMs == null ? 100 : delayMs);
    }
}
