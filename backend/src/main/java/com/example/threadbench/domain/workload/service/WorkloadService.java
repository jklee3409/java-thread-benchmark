package com.example.threadbench.domain.workload.service;

import com.example.threadbench.domain.benchmark.model.BenchmarkLayer;
import com.example.threadbench.domain.workload.dto.WorkloadResponse;
import com.example.threadbench.domain.workload.entity.SampleItem;
import com.example.threadbench.domain.workload.repository.SampleItemRepository;
import com.example.threadbench.global.exception.ResourceNotFoundException;
import com.example.threadbench.global.properties.AppProperties;
import com.example.threadbench.infrastructure.client.external.ExternalApiClient;
import com.example.threadbench.infrastructure.monitoring.BenchmarkTelemetryService;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class WorkloadService {

    private static final String CACHE_HIT_NAMESPACE = "cachehit:item:";
    private static final String MIXED_STATE_NAMESPACE = "mixed:state:";
    private static final String CONTENTION_COUNTER_NAMESPACE = "contention:counter:";

    private final SampleItemRepository sampleItemRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ExternalApiClient externalApiClient;
    private final ObservationRegistry observationRegistry;
    private final AppProperties appProperties;
    private final BenchmarkTelemetryService benchmarkTelemetryService;
    private final JdbcTemplate jdbcTemplate;

    public WorkloadResponse cacheHit(long id, String runId) {
        return measureOverall(runId, () -> {
            String key = CACHE_HIT_NAMESPACE + id;
            String value = observeLayer(runId, BenchmarkLayer.REDIS, () ->
                    Observation.createNotStarted("benchmark.redis.get", observationRegistry)
                            .lowCardinalityKeyValue("layer", "redis")
                            .observe(() -> stringRedisTemplate.opsForValue().get(key))
            );

            if (value == null) {
                value = "MISS";
            }

            return new WorkloadResponse("redis-heavy", appProperties.getMode(), id, value, 0, null);
        });
    }

    public WorkloadResponse dbRead(long id, String runId) {
        return measureOverall(runId, () -> {
            SampleItem item = observeLayer(runId, BenchmarkLayer.DB, () ->
                    Observation.createNotStarted("benchmark.db.read", observationRegistry)
                            .lowCardinalityKeyValue("layer", "db")
                            .observe(() -> findSampleItem(id))
            );

            return new WorkloadResponse("db-heavy", appProperties.getMode(), item.getId(), item.getPayload(), 0, null);
        });
    }

    public WorkloadResponse external(int delayMs, int status, String runId) {
        return measureOverall(runId, () -> {
            var response = observeLayer(runId, BenchmarkLayer.EXTERNAL,
                    () -> externalApiClient.fetchProduct(delayMs, status, runId));
            return new WorkloadResponse("io-heavy", appProperties.getMode(), -1L, String.valueOf(response), delayMs, null);
        });
    }

    public WorkloadResponse mixed(long id, int delayMs, String runId) {
        return measureOverall(runId, () ->
                        Observation.createNotStarted("benchmark.workload.mixed", observationRegistry)
                        .lowCardinalityKeyValue("scenario", "mixed")
                        .observe(() -> {
                            String cacheKey = MIXED_STATE_NAMESPACE + id;
                            String cacheState = observeLayer(runId, BenchmarkLayer.REDIS, () ->
                                    Observation.createNotStarted("benchmark.redis.get", observationRegistry)
                                            .lowCardinalityKeyValue("layer", "redis")
                                            .observe(() -> {
                                                String current = stringRedisTemplate.opsForValue().get(cacheKey);
                                                stringRedisTemplate.opsForValue()
                                                        .set(cacheKey, "seen", Duration.ofMinutes(10));
                                                return current;
                                            })
                            );

                            SampleItem item = observeLayer(runId, BenchmarkLayer.DB, () ->
                                    Observation.createNotStarted("benchmark.db.read", observationRegistry)
                                            .lowCardinalityKeyValue("layer", "db")
                                            .observe(() -> findSampleItem(id))
                            );

                            observeLayer(runId, BenchmarkLayer.EXTERNAL,
                                    () -> externalApiClient.fetchProduct(delayMs, 200, runId));

                            String responseValue = (cacheState == null ? "cold" : cacheState) + "|" + item.getPayload();
                            return new WorkloadResponse("mixed", appProperties.getMode(), id, responseValue, delayMs, null);
                        })
        );
    }

    public WorkloadResponse contentionHeavy(long id, int delayMs, int dbHoldMs, String runId) {
        return measureOverall(runId, () ->
                Observation.createNotStarted("benchmark.workload.contention", observationRegistry)
                        .lowCardinalityKeyValue("scenario", "contention-heavy")
                        .observe(() -> {
                            SampleItem item = observeLayer(runId, BenchmarkLayer.DB, () ->
                                    Observation.createNotStarted("benchmark.db.read", observationRegistry)
                                            .lowCardinalityKeyValue("layer", "db")
                                            .observe(() -> {
                                                holdDatabaseConnection(dbHoldMs);
                                                return findSampleItem(id);
                                            })
                            );

                            String counterValue = observeLayer(runId, BenchmarkLayer.REDIS, () ->
                                    Observation.createNotStarted("benchmark.redis.get", observationRegistry)
                                            .lowCardinalityKeyValue("layer", "redis")
                                            .observe(() -> {
                                                Long current = stringRedisTemplate.opsForValue()
                                                        .increment(CONTENTION_COUNTER_NAMESPACE + id);
                                                stringRedisTemplate.expire(
                                                        CONTENTION_COUNTER_NAMESPACE + id,
                                                        Duration.ofMinutes(10)
                                                );
                                                return String.valueOf(current);
                                            })
                            );

                            observeLayer(runId, BenchmarkLayer.EXTERNAL,
                                    () -> externalApiClient.fetchProduct(delayMs, 200, runId));

                            return new WorkloadResponse(
                                    "contention-heavy",
                                    appProperties.getMode(),
                                    item.getId(),
                                    counterValue + "|" + item.getPayload(),
                                    delayMs,
                                    dbHoldMs
                            );
                        })
        );
    }

    private SampleItem findSampleItem(long id) {
        return sampleItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample item not found: " + id));
    }

    private <T> T measureOverall(String runId, java.util.function.Supplier<T> supplier) {
        return measure(runId, BenchmarkLayer.OVERALL, supplier);
    }

    private <T> T observeLayer(String runId, BenchmarkLayer layer, java.util.function.Supplier<T> supplier) {
        return measure(runId, layer, supplier);
    }

    private <T> T measure(String runId, BenchmarkLayer layer, java.util.function.Supplier<T> supplier) {
        long startedAt = System.nanoTime();
        boolean success = false;
        Throwable failure = null;
        try {
            T result = supplier.get();
            success = true;
            return result;
        } catch (RuntimeException exception) {
            failure = exception;
            throw exception;
        } finally {
            benchmarkTelemetryService.record(runId, layer, System.nanoTime() - startedAt, success, failure);
        }
    }

    private void holdDatabaseConnection(int dbHoldMs) {
        if (dbHoldMs <= 0) {
            return;
        }
        double seconds = dbHoldMs / (double) TimeUnit.SECONDS.toMillis(1);
        jdbcTemplate.queryForObject("SELECT SLEEP(?)", Double.class, seconds);
    }
}
