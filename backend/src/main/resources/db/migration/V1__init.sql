CREATE TABLE IF NOT EXISTS sample_item (
    id BIGINT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS experiment_run (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mode VARCHAR(40) NOT NULL,
    scenario VARCHAR(100) NOT NULL,
    throughput DOUBLE NOT NULL,
    p95_latency_ms DOUBLE NOT NULL,
    error_rate DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sample_item (id, name, payload) VALUES
(1, 'item-1', 'payload-for-item-1'),
(2, 'item-2', 'payload-for-item-2'),
(3, 'item-3', 'payload-for-item-3')
ON DUPLICATE KEY UPDATE name = VALUES(name), payload = VALUES(payload);
