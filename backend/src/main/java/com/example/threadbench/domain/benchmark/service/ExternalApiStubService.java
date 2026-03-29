package com.example.threadbench.domain.benchmark.service;

import com.example.threadbench.domain.benchmark.entity.BenchmarkRun;
import com.example.threadbench.global.properties.ExternalApiProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalApiStubService {

    private final RestClient.Builder restClientBuilder;
    private final ExternalApiProperties externalApiProperties;

    public String registerRunStub(BenchmarkRun run) {
        if (run.getExternalDelayMs() == null && run.getExternalStatus() == null) {
            return null;
        }

        Map<String, Object> responseBody = new LinkedHashMap<>();
        responseBody.put("code", run.getExternalStatus() == null ? "OK" : "STATUS_" + run.getExternalStatus());
        responseBody.put("productId", 1);
        responseBody.put("name", "mock-product");
        responseBody.put("source", "wiremock");
        responseBody.put("benchmarkRunId", run.getId());
        responseBody.put("correlationId", run.getCorrelationId());
        responseBody.put("configuredDelayMs", run.getExternalDelayMs());
        responseBody.put("configuredStatus", run.getExternalStatus());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("priority", 1);
        payload.put("request", Map.of(
                "method", "GET",
                "urlPath", "/external/products",
                "headers", Map.of(
                        "X-Benchmark-Run-Id", Map.of("equalTo", run.getCorrelationId())
                )
        ));
        payload.put("response", Map.of(
                "status", run.getExternalStatus() == null ? 200 : run.getExternalStatus(),
                "fixedDelayMilliseconds", run.getExternalDelayMs() == null ? 0 : run.getExternalDelayMs(),
                "headers", Map.of("Content-Type", "application/json"),
                "jsonBody", responseBody
        ));

        Map<?, ?> createdMapping = adminClient().post()
                .uri("/__admin/mappings")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(Map.class);

        if (createdMapping == null || createdMapping.get("id") == null) {
            throw new IllegalStateException("WireMock mapping creation returned no id");
        }
        return createdMapping.get("id").toString();
    }

    public void removeRunStub(String stubId) {
        if (stubId == null || stubId.isBlank()) {
            return;
        }
        try {
            adminClient().delete()
                    .uri("/__admin/mappings/{stubId}", stubId)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception exception) {
            log.warn("Failed to remove WireMock stub {}", stubId, exception);
        }
    }

    private RestClient adminClient() {
        return restClientBuilder
                .baseUrl(externalApiProperties.getBaseUrl())
                .build();
    }
}
