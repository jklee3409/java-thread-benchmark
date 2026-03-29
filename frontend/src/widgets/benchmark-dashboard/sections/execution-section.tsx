import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
  formatDateTime,
  formatNumber,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type ExecutionSectionProps = {
  run: BenchmarkRunDetailResponse | BenchmarkRunSummaryResponse | null;
  isLoading: boolean;
  isPolling: boolean;
  isSubmitting: boolean;
  isRefreshingRuns: boolean;
  message: string;
  error: string;
};

export function ExecutionSection({
  run,
  isLoading,
  isPolling,
  isSubmitting,
  isRefreshingRuns,
  message,
  error,
}: ExecutionSectionProps) {
  const stateTone = error
    ? "danger"
    : isSubmitting || isRefreshingRuns || isPolling
      ? "warning"
      : run == null
        ? "neutral"
        : runStatusTone(run.status);

  const stateLabel = error
    ? "Check"
    : isSubmitting
      ? "Queueing"
      : isRefreshingRuns
        ? "Syncing"
        : isPolling
          ? "Live"
          : run == null
            ? "Idle"
            : runStatusLabel(run.status);

  return (
    <section className="dashboard-section" id="execution">
      <div className="execution-layout">
        <Panel className="state-panel">
          <div className="panel-head panel-head--spread">
            <h3>State</h3>
            <StatusPill tone={stateTone}>{stateLabel}</StatusPill>
          </div>

          <div className="state-stack">
            <div className="state-item">
              <span className="state-item-label">Run</span>
              <strong className="state-item-value">
                {run == null ? "-" : `#${run.id}`}
              </strong>
            </div>
            <div className="state-item">
              <span className="state-item-label">Target</span>
              <strong className="state-item-value">
                {run == null
                  ? "-"
                  : `${threadModeLabel(run.mode)} / ${scenarioLabel(run.scenario)}`}
              </strong>
            </div>
            <div className="state-item">
              <span className="state-item-label">Time</span>
              <strong className="state-item-value">
                {run == null
                  ? "-"
                  : formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}
              </strong>
            </div>
          </div>

          {isLoading ? <div className="alert alert-info">Loading...</div> : null}
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="alert alert-info">{message || "Ready"}</div>
          )}
        </Panel>

        <Panel className="state-panel">
          <div className="panel-head">
            <h3>Metrics</h3>
          </div>

          {run == null ? (
            <EmptyState
              title="선택된 실행이 없습니다."
              message="실행 후 Run을 선택하면 지표가 표시됩니다."
            />
          ) : (
            <>
              <div className="metric-grid metric-grid--four">
                <MetricCard
                  label="TPS"
                  value={`${formatNumber(run.throughput)} req/s`}
                  helper="throughput"
                />
                <MetricCard
                  label="p95"
                  value={`${formatNumber(run.p95LatencyMs)} ms`}
                  helper="latency"
                />
                <MetricCard
                  label="p99"
                  value={`${formatNumber(run.p99LatencyMs)} ms`}
                  helper="tail"
                />
                <MetricCard
                  label="Error"
                  value={`${formatNumber(run.errorRate)} %`}
                  helper="rate"
                  tone={run.errorRate > 0 ? "danger" : "success"}
                />
              </div>

              <div className="summary-meta">
                <span>{run.totalSamples} req</span>
                <span>{run.threadCount} threads</span>
                <span>{run.durationSeconds}s</span>
              </div>
            </>
          )}
        </Panel>
      </div>
    </section>
  );
}
