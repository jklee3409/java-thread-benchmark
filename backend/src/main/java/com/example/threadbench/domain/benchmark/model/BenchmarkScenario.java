package com.example.threadbench.domain.benchmark.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum BenchmarkScenario {
    REDIS_HEAVY("redis-heavy"),
    DB_HEAVY("db-heavy"),
    IO_HEAVY("io-heavy"),
    MIXED("mixed"),
    CONTENTION_HEAVY("contention-heavy");

    private final String value;

    BenchmarkScenario(String value) {
        this.value = value;
    }

    @JsonCreator
    public static BenchmarkScenario from(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Benchmark scenario must not be blank");
        }
        return switch (value.trim().toLowerCase(Locale.ROOT)) {
            case "cache-hit", "redis-heavy" -> REDIS_HEAVY;
            case "db-read", "db-heavy" -> DB_HEAVY;
            case "external", "io-heavy" -> IO_HEAVY;
            case "mixed" -> MIXED;
            case "contention-heavy" -> CONTENTION_HEAVY;
            default -> {
                String normalized = value.trim().toUpperCase(Locale.ROOT).replace('-', '_');
                yield BenchmarkScenario.valueOf(normalized);
            }
        };
    }

    @JsonValue
    public String value() {
        return value;
    }

    public boolean requiresSampleId() {
        return this != IO_HEAVY;
    }

    public boolean usesExternalApi() {
        return this == IO_HEAVY || this == MIXED || this == CONTENTION_HEAVY;
    }

    public boolean supportsExternalStatus() {
        return this == IO_HEAVY;
    }

    public boolean supportsDbHoldMs() {
        return this == CONTENTION_HEAVY;
    }

    public String requestPath(long sampleId, int delayMs, int status, int dbHoldMs) {
        return switch (this) {
            case REDIS_HEAVY -> "/api/workloads/cache-hit/" + sampleId;
            case DB_HEAVY -> "/api/workloads/db-read/" + sampleId;
            case IO_HEAVY -> "/api/workloads/external?delayMs=" + delayMs + "&status=" + status;
            case MIXED -> "/api/workloads/mixed/" + sampleId + "?delayMs=" + delayMs;
            case CONTENTION_HEAVY -> "/api/workloads/contention-heavy/" + sampleId
                    + "?delayMs=" + delayMs
                    + "&dbHoldMs=" + dbHoldMs;
        };
    }
}
