import {
  BenchmarkRunDetailResponse,
  formatDateTime,
  formatNumber,
  layerLabel,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { InfoRow } from "@/shared/ui/info-row";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunDetailPanelProps = {
  run: BenchmarkRunDetailResponse | null;
  isLoading?: boolean;
  isPolling?: boolean;
};

export function RunDetailPanel({
  run,
  isLoading = false,
  isPolling = false,
}: RunDetailPanelProps) {
  const latestSnapshot = run?.metricSnapshots.at(-1);

  return (
    <Panel className="detail-panel">
      <div className="panel-head panel-head--spread">
        <h3>Report</h3>
        <div className="pill-row">
          {isPolling ? <StatusPill tone="warning">Live</StatusPill> : null}
          <StatusPill tone={run == null ? "neutral" : runStatusTone(run.status)}>
            {run == null ? "Idle" : runStatusLabel(run.status)}
          </StatusPill>
        </div>
      </div>

      {isLoading ? <div className="alert alert-info">Loading...</div> : null}

      {run == null ? (
        <EmptyState
          title="선택된 Run이 없습니다."
          message="이력에서 Run을 선택하면 결과가 표시됩니다."
        />
      ) : (
        <div className="detail-layout">
          <div className="detail-primary">
            <div className="summary-callout">
              <strong>
                {scenarioLabel(run.scenario)} / {threadModeLabel(run.mode)}
              </strong>
              <p>
                {run.benchmarkSummary?.summaryText ??
                  "요약 메시지가 아직 생성되지 않았습니다."}
              </p>
              <p className="panel-copy">
                {run.benchmarkSummary?.bottleneckLayer
                  ? layerLabel(run.benchmarkSummary.bottleneckLayer)
                  : "분석 중"}
              </p>
            </div>

            <div className="metric-grid metric-grid--detail">
              <MetricCard label="Total" value={`${run.totalSamples}`} helper="requests" />
              <MetricCard
                label="Success"
                value={`${run.successSamples}`}
                helper="ok"
                tone="success"
              />
              <MetricCard
                label="Fail"
                value={`${run.errorSamples}`}
                helper="error"
                tone={run.errorSamples > 0 ? "danger" : "neutral"}
              />
              <MetricCard
                label="Avg"
                value={`${formatNumber(run.averageLatencyMs)} ms`}
                helper="latency"
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
                label="TPS"
                value={`${formatNumber(run.throughput)} req/s`}
                helper="throughput"
              />
              <MetricCard
                label="Error"
                value={`${formatNumber(run.errorRate)} %`}
                helper="rate"
                tone={run.errorRate > 0 ? "danger" : "success"}
              />
            </div>

            {latestSnapshot ? (
              <div className="detail-subpanel">
                <h4 className="detail-section-title">Snapshot</h4>
                <div className="metric-grid metric-grid--snapshot">
                  <MetricCard label="Active" value={String(latestSnapshot.activeConnections)} helper="db" />
                  <MetricCard
                    label="Pending"
                    value={String(latestSnapshot.pendingConnections)}
                    helper="db"
                    tone={latestSnapshot.pendingConnections > 0 ? "warning" : "neutral"}
                  />
                  <MetricCard label="Total" value={String(latestSnapshot.totalConnections)} helper="db" />
                  <MetricCard label="Live" value={String(latestSnapshot.liveThreads)} helper="jvm" />
                  <MetricCard label="Peak" value={String(latestSnapshot.peakThreads)} helper="jvm" />
                  <MetricCard
                    label="Started"
                    value={String(latestSnapshot.totalStartedThreads)}
                    helper="jvm"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="detail-secondary">
            <div className="detail-subpanel">
              <h4 className="detail-section-title">Config</h4>
              <div className="info-table">
                <InfoRow label="ID" value={`#${run.id}`} />
                <InfoRow label="Mode" value={threadModeLabel(run.mode)} />
                <InfoRow label="Scenario" value={scenarioLabel(run.scenario)} />
                <InfoRow label="Threads" value={String(run.threadCount)} />
                <InfoRow label="Ramp-up" value={`${run.rampUpSeconds}s`} />
                <InfoRow label="Duration" value={`${run.durationSeconds}s`} />
                <InfoRow label="Loops" value={String(run.loopCount)} />
                <InfoRow label="Pool" value={String(run.connectionPoolSize)} />
                <InfoRow
                  label="Delay"
                  value={run.externalDelayMs == null ? "-" : `${run.externalDelayMs} ms`}
                />
                <InfoRow
                  label="Status"
                  value={run.externalStatus == null ? "-" : String(run.externalStatus)}
                />
                <InfoRow label="Sample" value={run.sampleId == null ? "-" : String(run.sampleId)} />
                <InfoRow
                  label="DB Hold"
                  value={run.dbHoldMs == null ? "-" : `${run.dbHoldMs} ms`}
                />
              </div>
            </div>

            <div className="detail-subpanel">
              <h4 className="detail-section-title">Meta</h4>
              <div className="info-table">
                <InfoRow label="Created" value={formatDateTime(run.createdAt)} />
                <InfoRow label="Started" value={formatDateTime(run.startedAt)} />
                <InfoRow label="Done" value={formatDateTime(run.completedAt)} />
                <InfoRow label="Path" value={run.requestPath} mono />
                <InfoRow label="Correlation" value={run.correlationId} mono />
                <InfoRow label="Failure" value={run.failureMessage ?? "-"} />
                <InfoRow label="CSV" value={run.resultFilePath ?? "-"} mono />
                <InfoRow label="JMeter" value={run.jmeterLogPath ?? "-"} mono />
                <InfoRow label="Output" value={run.processOutputPath ?? "-"} mono />
              </div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
