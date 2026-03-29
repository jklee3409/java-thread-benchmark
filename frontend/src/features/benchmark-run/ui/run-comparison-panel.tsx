import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
  formatDelta,
  formatNumber,
  scenarioLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";

type RunComparisonPanelProps = {
  runs: BenchmarkRunSummaryResponse[];
  baselineRun: BenchmarkRunDetailResponse | null;
  comparisonRun: BenchmarkRunDetailResponse | null;
  comparisonRunId: number | null;
  onComparisonRunIdChange: (runId: number | null) => void;
};

export function RunComparisonPanel({
  runs,
  baselineRun,
  comparisonRun,
  comparisonRunId,
  onComparisonRunIdChange,
}: RunComparisonPanelProps) {
  const comparisonCandidates = runs.filter((run) => run.id !== baselineRun?.id);

  return (
    <Panel className="comparison-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>Run Comparison</h2>
          <p className="panel-copy">
            Compare the selected run against another run from the same history list.
          </p>
        </div>

        <label className="field field--compact">
          <span>Compare Against</span>
          <select
            value={comparisonRunId ?? ""}
            onChange={(event) =>
              onComparisonRunIdChange(
                event.target.value ? Number(event.target.value) : null,
              )
            }
          >
            <option value="">No comparison</option>
            {comparisonCandidates.map((run) => (
              <option key={run.id} value={run.id}>
                #{run.id} {run.mode} {scenarioLabel(run.scenario)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {baselineRun == null || comparisonRun == null ? (
        <EmptyState message="Select a baseline run and a comparison run to see deltas." />
      ) : (
        <div className="comparison-content">
          <div className="comparison-header">
            <div className="comparison-run">
              <span>Baseline</span>
              <strong>
                #{baselineRun.id} {baselineRun.mode}
              </strong>
              <p>{scenarioLabel(baselineRun.scenario)}</p>
            </div>
            <div className="comparison-run">
              <span>Comparison</span>
              <strong>
                #{comparisonRun.id} {comparisonRun.mode}
              </strong>
              <p>{scenarioLabel(comparisonRun.scenario)}</p>
            </div>
          </div>

          <div className="metric-grid metric-grid--comparison">
            <MetricCard
              label="Throughput Delta"
              value={`${formatDelta(comparisonRun.throughput - baselineRun.throughput)} req/s`}
            />
            <MetricCard
              label="P95 Delta"
              value={`${formatDelta(comparisonRun.p95LatencyMs - baselineRun.p95LatencyMs)} ms`}
            />
            <MetricCard
              label="P99 Delta"
              value={`${formatDelta(comparisonRun.p99LatencyMs - baselineRun.p99LatencyMs)} ms`}
            />
            <MetricCard
              label="Error Rate Delta"
              value={`${formatDelta(comparisonRun.errorRate - baselineRun.errorRate)} %`}
            />
          </div>

          <div className="comparison-table">
            <div className="comparison-row">
              <span>Thread Count</span>
              <strong>{baselineRun.threadCount}</strong>
              <strong>{comparisonRun.threadCount}</strong>
            </div>
            <div className="comparison-row">
              <span>Connection Pool</span>
              <strong>{baselineRun.connectionPoolSize}</strong>
              <strong>{comparisonRun.connectionPoolSize}</strong>
            </div>
            <div className="comparison-row">
              <span>Latest Pending DB</span>
              <strong>{latestPendingConnections(baselineRun)}</strong>
              <strong>{latestPendingConnections(comparisonRun)}</strong>
            </div>
            <div className="comparison-row">
              <span>Bottleneck</span>
              <strong>{baselineRun.benchmarkSummary?.bottleneckLayer ?? "-"}</strong>
              <strong>{comparisonRun.benchmarkSummary?.bottleneckLayer ?? "-"}</strong>
            </div>
            <div className="comparison-row">
              <span>Summary</span>
              <strong>{shortSummary(baselineRun)}</strong>
              <strong>{shortSummary(comparisonRun)}</strong>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

function latestPendingConnections(run: BenchmarkRunDetailResponse): string {
  const latest = run.metricSnapshots.at(-1);
  return latest == null ? "-" : formatNumber(latest.pendingConnections);
}

function shortSummary(run: BenchmarkRunDetailResponse): string {
  if (run.benchmarkSummary == null) {
    return "-";
  }
  return run.benchmarkSummary.summaryText;
}
