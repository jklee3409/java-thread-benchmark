CREATE TABLE IF NOT EXISTS benchmark_run (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    correlation_id VARCHAR(36) NOT NULL,
    mode VARCHAR(20) NOT NULL,
    scenario VARCHAR(20) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    sample_id BIGINT NULL,
    external_delay_ms INT NULL,
    external_status INT NULL,
    thread_count INT NOT NULL,
    ramp_up_seconds INT NOT NULL,
    duration_seconds INT NOT NULL,
    loop_count INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    failure_message TEXT NULL,
    result_file_path VARCHAR(500) NULL,
    jmeter_log_path VARCHAR(500) NULL,
    process_output_path VARCHAR(500) NULL,
    total_samples INT NOT NULL DEFAULT 0,
    success_samples INT NOT NULL DEFAULT 0,
    error_samples INT NOT NULL DEFAULT 0,
    average_latency_ms DOUBLE NOT NULL DEFAULT 0,
    p95_latency_ms DOUBLE NOT NULL DEFAULT 0,
    throughput DOUBLE NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    CONSTRAINT uk_benchmark_run_correlation_id UNIQUE (correlation_id)
);

CREATE TABLE IF NOT EXISTS benchmark_layer_metric (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    benchmark_run_id BIGINT NOT NULL,
    layer VARCHAR(20) NOT NULL,
    invocation_count BIGINT NOT NULL DEFAULT 0,
    error_count BIGINT NOT NULL DEFAULT 0,
    average_latency_ms DOUBLE NOT NULL DEFAULT 0,
    p95_latency_ms DOUBLE NOT NULL DEFAULT 0,
    max_latency_ms DOUBLE NOT NULL DEFAULT 0,
    CONSTRAINT fk_benchmark_layer_metric_run
        FOREIGN KEY (benchmark_run_id) REFERENCES benchmark_run (id)
        ON DELETE CASCADE
);
