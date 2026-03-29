package com.example.threadbench.infrastructure.client.external;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ExternalApiClient {

    private static final ParameterizedTypeReference<Map<String, Object>> RESPONSE_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private final RestClient restClient;
    private final ObservationRegistry observationRegistry;

    public Map<String, Object> fetchProduct(int delayMs, int status, String runId) {
        return Observation.createNotStarted("benchmark.external.call", observationRegistry)
                .lowCardinalityKeyValue("layer", "external")
                .observe(() -> restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/external/products")
                                .queryParam("delayMs", delayMs)
                                .queryParam("status", status)
                                .build())
                        .header("X-Benchmark-Run-Id", runId == null ? "adhoc" : runId)
                        .header("X-External-Delay-Ms", String.valueOf(delayMs))
                        .header("X-External-Status", String.valueOf(status))
                        .retrieve()
                        .body(RESPONSE_TYPE));
    }
}
