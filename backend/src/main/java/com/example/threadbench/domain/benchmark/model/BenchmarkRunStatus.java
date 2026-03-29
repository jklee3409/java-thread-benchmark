package com.example.threadbench.domain.benchmark.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BenchmarkRunStatus {
    QUEUED("queued"),
    RUNNING("running"),
    SUCCEEDED("succeeded"),
    FAILED("failed");

    private final String value;

    BenchmarkRunStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }
}
