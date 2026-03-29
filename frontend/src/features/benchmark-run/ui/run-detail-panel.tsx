import {
  BenchmarkRunDetailResponse,
  formatNumber,
  scenarioLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { InfoRow } from "@/shared/ui/info-row";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";

type RunDetailPanelProps = {
  run: BenchmarkRunDetailResponse | null;
};

export function RunDetailPanel({ run }: RunDetailPanelProps) {
  return (
    <Panel className="detail-panel">
      <div className="panel-head">
        <h2>Run Detail</h2>
        <span>{run ? `#${run.id}` : "No selection"}</span>
      </div>

      {run == null ? (
        <EmptyState message="Select a run to view details." />
      ) : (
        <div className="detail-content">
          <div className="metric-grid">
            <MetricCard label="Status" value={run.status} />
            <MetricCard label="Throughput" value={`${formatNumber(run.throughput)} req/s`} />
            <MetricCard label="Avg Latency" value={`${formatNumber(run.averageLatencyMs)} ms`} />
            <MetricCard label="P95 Latency" value={`${formatNumber(run.p95LatencyMs)} ms`} />
            <MetricCard label="P99 Latency" value={`${formatNumber(run.p99LatencyMs)} ms`} />
            <MetricCard label="Error Rate" value={`${formatNumber(run.errorRate)} %`} />
          </div>

          <div className="kv-table">
            <InfoRow label="Scenario" value={scenarioLabel(run.scenario)} />
            <InfoRow label="Mode" value={run.mode} />
            <InfoRow label="Thread Count" value={String(run.threadCount)} />
            <InfoRow label="Ramp-up" value={`${run.rampUpSeconds}s`} />
            <InfoRow label="Duration" value={`${run.durationSeconds}s`} />
            <InfoRow label="Loop Count" value={String(run.loopCount)} />
            <InfoRow label="Pool Size" value={String(run.connectionPoolSize)} />
            <InfoRow label="DB Hold" value={run.dbHoldMs == null ? "-" : `${run.dbHoldMs} ms`} />
            <InfoRow label="Request Path" value={run.requestPath} mono />
            <InfoRow label="Correlation ID" value={run.correlationId} mono />
            <InfoRow label="Result CSV" value={run.resultFilePath ?? "-"} mono />
            <InfoRow label="JMeter Log" value={run.jmeterLogPath ?? "-"} mono />
            <InfoRow label="Process Output" value={run.processOutputPath ?? "-"} mono />
            <InfoRow label="Failure Message" value={run.failureMessage ?? "-"} mono />
          </div>

          <div className="callout-block">
            <h3>Benchmark Summary</h3>
            <p>{run.benchmarkSummary?.summaryText ?? "No summary available yet."}</p>
            <p className="callout-subtle">
              {run.benchmarkSummary?.recommendationText ??
                "Recommendations will appear after the run stores layer metrics and snapshots."}
            </p>
          </div>

          <div className="notes-block">
            <h3>Bottleneck Notes</h3>
            {run.bottleneckNotes.length === 0 ? (
              <EmptyState message="No bottleneck notes have been generated yet." />
            ) : (
              <div className="note-list">
                {run.bottleneckNotes.map((note, index) => (
                  <article key={`${note.createdAt}-${index}`} className="note-card">
                    <strong>
                      {note.severity}
                      {note.layer ? ` / ${note.layer}` : ""}
                    </strong>
                    <p>{note.message}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}
