ALTER TABLE benchmark_run
    MODIFY COLUMN scenario VARCHAR(40) NOT NULL;

ALTER TABLE benchmark_run
    ADD COLUMN db_hold_ms INT NULL AFTER external_status,
    ADD COLUMN connection_pool_size INT NOT NULL DEFAULT 0 AFTER loop_count,
    ADD COLUMN p99_latency_ms DOUBLE NOT NULL DEFAULT 0 AFTER p95_latency_ms,
    ADD COLUMN error_rate DOUBLE NOT NULL DEFAULT 0 AFTER throughput;

ALTER TABLE benchmark_layer_metric
    ADD COLUMN timeout_count BIGINT NOT NULL DEFAULT 0 AFTER error_count,
    ADD COLUMN p99_latency_ms DOUBLE NOT NULL DEFAULT 0 AFTER p95_latency_ms;

CREATE TABLE IF NOT EXISTS scenario_definition (
    code VARCHAR(40) NOT NULL PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    layers VARCHAR(120) NOT NULL,
    contention_hint VARCHAR(255) NOT NULL
);

INSERT INTO scenario_definition (code, display_name, description, layers, contention_hint) VALUES
('REDIS_HEAVY', 'Redis Heavy', 'Warm cache read path focused on Redis latency and cache hit throughput.', 'REDIS', 'Warm cache keys are preloaded during startup.'),
('DB_HEAVY', 'DB Heavy', 'Direct MySQL read path used to compare request throughput against a limited HikariCP pool.', 'DB', 'Increase request concurrency above the Hikari pool size to expose pool wait time.'),
('IO_HEAVY', 'IO Heavy', 'External HTTP call path used to compare virtual and platform thread behavior under blocking I/O.', 'EXTERNAL', 'Increase external delay or error status to amplify blocking time.'),
('MIXED', 'Mixed', 'Every request touches Redis, MySQL, and the external mock API to mimic a layered service request.', 'REDIS,DB,EXTERNAL', 'Use medium concurrency and delay to see layer composition shifts.'),
('CONTENTION_HEAVY', 'Contention Heavy', 'Holds a MySQL connection with SELECT SLEEP before additional work to trigger pool contention.', 'DB,REDIS,EXTERNAL', 'Set db_hold_ms to 150ms+ and run with concurrency far above the pool size.')
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    layers = VALUES(layers),
    contention_hint = VALUES(contention_hint);

CREATE TABLE IF NOT EXISTS experiment_config (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    benchmark_run_id BIGINT NOT NULL,
    thread_mode VARCHAR(20) NOT NULL,
    scenario_code VARCHAR(40) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    sample_id BIGINT NULL,
    external_delay_ms INT NULL,
    external_status INT NULL,
    db_hold_ms INT NULL,
    thread_count INT NOT NULL,
    ramp_up_seconds INT NOT NULL,
    duration_seconds INT NOT NULL,
    loop_count INT NOT NULL,
    connection_pool_size INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_experiment_config_run UNIQUE (benchmark_run_id),
    CONSTRAINT fk_experiment_config_run
        FOREIGN KEY (benchmark_run_id) REFERENCES benchmark_run (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metric_snapshot (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    benchmark_run_id BIGINT NOT NULL,
    snapshot_type VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_connections INT NOT NULL DEFAULT 0,
    idle_connections INT NOT NULL DEFAULT 0,
    pending_connections INT NOT NULL DEFAULT 0,
    total_connections INT NOT NULL DEFAULT 0,
    live_threads INT NOT NULL DEFAULT 0,
    daemon_threads INT NOT NULL DEFAULT 0,
    peak_threads INT NOT NULL DEFAULT 0,
    total_started_threads BIGINT NOT NULL DEFAULT 0,
    payload_json TEXT NULL,
    CONSTRAINT fk_metric_snapshot_run
        FOREIGN KEY (benchmark_run_id) REFERENCES benchmark_run (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS benchmark_summary (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    benchmark_run_id BIGINT NOT NULL,
    error_rate DOUBLE NOT NULL DEFAULT 0,
    p99_latency_ms DOUBLE NOT NULL DEFAULT 0,
    bottleneck_layer VARCHAR(20) NULL,
    summary_text TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_benchmark_summary_run UNIQUE (benchmark_run_id),
    CONSTRAINT fk_benchmark_summary_run
        FOREIGN KEY (benchmark_run_id) REFERENCES benchmark_run (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bottleneck_analysis_note (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    benchmark_run_id BIGINT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    layer VARCHAR(20) NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bottleneck_analysis_note_run
        FOREIGN KEY (benchmark_run_id) REFERENCES benchmark_run (id)
        ON DELETE CASCADE
);
