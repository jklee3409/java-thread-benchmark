package com.example.threadbench.client;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ExternalApiClient {

    private final RestClient restClient;
    private final ObservationRegistry observationRegistry;

    public Map<?, ?> fetchProduct(int delayMs, int status) {
        return Observation.createNotStarted("benchmark.external.call", observationRegistry)
                .lowCardinalityKeyValue("layer", "external")
                .observe(() -> restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/external/products")
                                .queryParam("delayMs", delayMs)
                                .queryParam("status", status)
                                .build())
                        .retrieve()
                        .body(Map.class));
    }
}
