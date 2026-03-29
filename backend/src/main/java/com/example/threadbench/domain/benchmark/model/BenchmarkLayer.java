package com.example.threadbench.domain.benchmark.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BenchmarkLayer {
    OVERALL("overall"),
    REDIS("redis"),
    DB("db"),
    EXTERNAL("external");

    private final String value;

    BenchmarkLayer(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }
}
