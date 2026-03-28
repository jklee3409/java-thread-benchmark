package com.example.threadbench.service;

import com.example.threadbench.client.ExternalApiClient;
import com.example.threadbench.config.AppProperties;
import com.example.threadbench.dto.WorkloadResponse;
import com.example.threadbench.entity.SampleItem;
import com.example.threadbench.repository.SampleItemRepository;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class WorkloadService {

    private final SampleItemRepository sampleItemRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ExternalApiClient externalApiClient;
    private final ObservationRegistry observationRegistry;
    private final AppProperties appProperties;

    public WorkloadResponse cacheHit(long id) {
        String key = "item:" + id;
        String value = Observation.createNotStarted("benchmark.redis.get", observationRegistry)
                .lowCardinalityKeyValue("layer", "redis")
                .observe(() -> stringRedisTemplate.opsForValue().get(key));

        if (value == null) {
            value = "MISS";
        }

        return new WorkloadResponse("cache-hit", appProperties.getMode(), -1L, value, 0);
    }

    public WorkloadResponse dbRead(long id) {
        SampleItem item = Observation.createNotStarted("benchmark.db.read", observationRegistry)
                .lowCardinalityKeyValue("layer", "db")
                .observe(() -> findSampleItem(id));

        return new WorkloadResponse("db-read", appProperties.getMode(), item.getId(), item.getPayload(), 0);
    }

    public WorkloadResponse external(int delayMs, int status) {
        var response = externalApiClient.fetchProduct(delayMs, status);
        return new WorkloadResponse("external", appProperties.getMode(), -1L, String.valueOf(response), delayMs);
    }

    public WorkloadResponse mixed(long id, int delayMs) {
        return Observation.createNotStarted("benchmark.workload.mixed", observationRegistry)
                .lowCardinalityKeyValue("scenario", "mixed")
                .observe(() -> {
                    String cacheKey = "item:" + id;
                    String cached = Observation.createNotStarted("benchmark.redis.get", observationRegistry)
                            .lowCardinalityKeyValue("layer", "redis")
                            .observe(() -> stringRedisTemplate.opsForValue().get(cacheKey));

                    String finalValue = cached;
                    if (finalValue == null) {
                        SampleItem item = Observation.createNotStarted("benchmark.db.read", observationRegistry)
                                .lowCardinalityKeyValue("layer", "db")
                                .observe(() -> findSampleItem(id));
                        finalValue = item.getPayload();
                        stringRedisTemplate.opsForValue().set(cacheKey, finalValue, Duration.ofMinutes(10));
                    }

                    externalApiClient.fetchProduct(delayMs, 200);
                    return new WorkloadResponse("mixed", appProperties.getMode(), id, finalValue, delayMs);
                });
    }

    private SampleItem findSampleItem(long id) {
        return sampleItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Sample item not found: " + id));
    }
}
