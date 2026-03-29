export type Scenario =
  | "redis-heavy"
  | "db-heavy"
  | "io-heavy"
  | "mixed"
  | "contention-heavy";

export type RunStatus = "queued" | "running" | "succeeded" | "failed";

export type BenchmarkOptionsResponse = {
  currentMode: string;
  defaultExternalDelayMs: number;
  defaultDbHoldMs: number;
  defaultThreadCount: number;
  defaultRampUpSeconds: number;
  defaultDurationSeconds: number;
  defaultLoopCount: number;
  scenarios: Scenario[];
};

export type BenchmarkRunSummaryResponse = {
  id: number;
  mode: string;
  scenario: Scenario;
  status: RunStatus;
  threadCount: number;
  durationSeconds: number;
  totalSamples: number;
  errorSamples: number;
  throughput: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type BenchmarkLayerMetricResponse = {
  layer: string;
  invocationCount: number;
  errorCount: number;
  timeoutCount: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  maxLatencyMs: number;
};

export type ExperimentConfigResponse = {
  threadMode: string;
  scenario: Scenario;
  requestPath: string;
  sampleId: number | null;
  externalDelayMs: number | null;
  externalStatus: number | null;
  dbHoldMs: number | null;
  threadCount: number;
  rampUpSeconds: number;
  durationSeconds: number;
  loopCount: number;
  connectionPoolSize: number;
  createdAt: string;
};

export type BenchmarkSummaryResponse = {
  errorRate: number;
  p99LatencyMs: number;
  bottleneckLayer: string | null;
  summaryText: string;
  recommendationText: string;
  createdAt: string;
};

export type MetricSnapshotResponse = {
  snapshotType: string;
  recordedAt: string;
  activeConnections: number;
  idleConnections: number;
  pendingConnections: number;
  totalConnections: number;
  liveThreads: number;
  daemonThreads: number;
  peakThreads: number;
  totalStartedThreads: number;
  payloadJson: string | null;
};

export type BottleneckAnalysisNoteResponse = {
  severity: string;
  layer: string | null;
  message: string;
  createdAt: string;
};

export type BenchmarkRunDetailResponse = BenchmarkRunSummaryResponse & {
  correlationId: string;
  requestPath: string;
  sampleId: number | null;
  externalDelayMs: number | null;
  externalStatus: number | null;
  dbHoldMs: number | null;
  rampUpSeconds: number;
  loopCount: number;
  connectionPoolSize: number;
  successSamples: number;
  averageLatencyMs: number;
  failureMessage: string | null;
  resultFilePath: string | null;
  jmeterLogPath: string | null;
  processOutputPath: string | null;
  experimentConfig: ExperimentConfigResponse | null;
  benchmarkSummary: BenchmarkSummaryResponse | null;
  metricSnapshots: MetricSnapshotResponse[];
  bottleneckNotes: BottleneckAnalysisNoteResponse[];
  layerMetrics: BenchmarkLayerMetricResponse[];
};

export type BenchmarkRunExportResponse = {
  run: BenchmarkRunDetailResponse;
};

export type CreateBenchmarkRunPayload = {
  scenario: Scenario;
  sampleId?: number;
  delayMs?: number;
  externalStatus?: number;
  dbHoldMs?: number;
  threadCount: number;
  rampUpSeconds: number;
  durationSeconds: number;
  loopCount: number;
};
