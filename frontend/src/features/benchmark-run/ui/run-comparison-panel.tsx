import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
  formatDateTime,
  formatDelta,
  formatNumber,
  layerLabel,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunComparisonPanelProps = {
  runs: BenchmarkRunSummaryResponse[];
  baselineRun: BenchmarkRunDetailResponse | null;
  comparisonRun: BenchmarkRunDetailResponse | null;
  baselineRunId: number | null;
  comparisonRunId: number | null;
  isBaselineLoading: boolean;
  isComparisonLoading: boolean;
  onBaselineRunIdChange: (runId: number | null) => void;
  onComparisonRunIdChange: (runId: number | null) => void;
};

export function RunComparisonPanel({
  runs,
  baselineRun,
  comparisonRun,
  baselineRunId,
  comparisonRunId,
  isBaselineLoading,
  isComparisonLoading,
  onBaselineRunIdChange,
  onComparisonRunIdChange,
}: RunComparisonPanelProps) {
  const comparisonCandidates = runs.filter((run) => run.id !== baselineRunId);

  return (
    <Panel className="comparison-panel">
      <div className="comparison-controls">
        <label className="field">
          <span className="field-label">기준 Run</span>
          <select
            value={baselineRunId ?? ""}
            className="field-control"
            onChange={(event) =>
              onBaselineRunIdChange(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          >
            <option value="">선택 안 함</option>
            {runs.map((run) => (
              <option key={run.id} value={run.id}>
                #{run.id} / {threadModeLabel(run.mode)} / {scenarioLabel(run.scenario)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">비교 Run</span>
          <select
            value={comparisonRunId ?? ""}
            className="field-control"
            onChange={(event) =>
              onComparisonRunIdChange(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          >
            <option value="">선택 안 함</option>
            {comparisonCandidates.map((run) => (
              <option key={run.id} value={run.id}>
                #{run.id} / {threadModeLabel(run.mode)} / {scenarioLabel(run.scenario)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {runs.length < 2 ? (
        <EmptyState
          title="비교할 실행이 부족합니다."
          message="최소 2개의 Run이 있어야 비교 표를 만들 수 있습니다."
        />
      ) : isBaselineLoading || isComparisonLoading ? (
        <div className="alert alert-info">비교 대상을 불러오는 중입니다.</div>
      ) : baselineRun == null || comparisonRun == null ? (
        <EmptyState
          title="비교할 Run을 선택하세요."
          message="기준 Run과 비교 Run을 각각 선택하면 핵심 지표 차이가 계산됩니다."
        />
      ) : (
        <div className="section-stack">
          <div className="comparison-overview">
            <RunCard title="기준 Run" run={baselineRun} />
            <RunCard title="비교 Run" run={comparisonRun} />
          </div>

          <div className="metric-grid metric-grid--four">
            <MetricCard
              label="TPS 차이"
              value={`${formatDelta(comparisonRun.throughput - baselineRun.throughput)} req/s`}
              helper="양수면 비교 Run 우세"
              tone={
                comparisonRun.throughput >= baselineRun.throughput ? "success" : "danger"
              }
            />
            <MetricCard
              label="p95 차이"
              value={`${formatDelta(comparisonRun.p95LatencyMs - baselineRun.p95LatencyMs)} ms`}
              helper="음수면 비교 Run 우세"
              tone={
                comparisonRun.p95LatencyMs <= baselineRun.p95LatencyMs
                  ? "success"
                  : "danger"
              }
            />
            <MetricCard
              label="p99 차이"
              value={`${formatDelta(comparisonRun.p99LatencyMs - baselineRun.p99LatencyMs)} ms`}
              helper="음수면 비교 Run 우세"
              tone={
                comparisonRun.p99LatencyMs <= baselineRun.p99LatencyMs
                  ? "success"
                  : "danger"
              }
            />
            <MetricCard
              label="오류율 차이"
              value={`${formatDelta(comparisonRun.errorRate - baselineRun.errorRate)} %`}
              helper="음수면 비교 Run 우세"
              tone={
                comparisonRun.errorRate <= baselineRun.errorRate ? "success" : "danger"
              }
            />
          </div>

          <div className="table-shell">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>지표</th>
                  <th>기준 Run</th>
                  <th>비교 Run</th>
                  <th>차이</th>
                </tr>
              </thead>
              <tbody>
                {buildRows(baselineRun, comparisonRun).map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.baseline}</td>
                    <td>{row.comparison}</td>
                    <td
                      className={
                        row.deltaTone
                          ? `comparison-delta comparison-delta--${row.deltaTone}`
                          : undefined
                      }
                    >
                      {row.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Panel>
  );
}

function RunCard({
  title,
  run,
}: {
  title: string;
  run: BenchmarkRunDetailResponse;
}) {
  return (
    <div className="comparison-run-card">
      <div className="comparison-run-head">
        <div>
          <span>{title}</span>
          <strong>#{run.id}</strong>
        </div>
        <StatusPill tone={runStatusTone(run.status)}>
          {runStatusLabel(run.status)}
        </StatusPill>
      </div>
      <p>
        {threadModeLabel(run.mode)} / {scenarioLabel(run.scenario)}
      </p>
      <p>{formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}</p>
    </div>
  );
}

function buildRows(
  baselineRun: BenchmarkRunDetailResponse,
  comparisonRun: BenchmarkRunDetailResponse,
) {
  return [
    createNumericRow("처리량", baselineRun.throughput, comparisonRun.throughput, "req/s", "higher"),
    createNumericRow(
      "평균 지연",
      baselineRun.averageLatencyMs,
      comparisonRun.averageLatencyMs,
      "ms",
      "lower",
    ),
    createNumericRow("p95 지연", baselineRun.p95LatencyMs, comparisonRun.p95LatencyMs, "ms", "lower"),
    createNumericRow("p99 지연", baselineRun.p99LatencyMs, comparisonRun.p99LatencyMs, "ms", "lower"),
    createNumericRow("오류율", baselineRun.errorRate, comparisonRun.errorRate, "%", "lower"),
    {
      label: "총 요청",
      baseline: `${baselineRun.totalSamples}건`,
      comparison: `${comparisonRun.totalSamples}건`,
      delta: `${comparisonRun.totalSamples - baselineRun.totalSamples}건`,
      deltaTone:
        comparisonRun.totalSamples === baselineRun.totalSamples
          ? "neutral"
          : comparisonRun.totalSamples > baselineRun.totalSamples
            ? "positive"
            : "negative",
    },
    {
      label: "주요 병목",
      baseline: baselineRun.benchmarkSummary?.bottleneckLayer
        ? layerLabel(baselineRun.benchmarkSummary.bottleneckLayer)
        : "-",
      comparison: comparisonRun.benchmarkSummary?.bottleneckLayer
        ? layerLabel(comparisonRun.benchmarkSummary.bottleneckLayer)
        : "-",
      delta: "-",
      deltaTone: null,
    },
  ];
}

function createNumericRow(
  label: string,
  baseline: number,
  comparison: number,
  unit: string,
  direction: "higher" | "lower",
) {
  const delta = comparison - baseline;
  const improved = direction === "higher" ? delta > 0 : delta < 0;
  const deltaTone = delta === 0 ? "neutral" : improved ? "positive" : "negative";

  return {
    label,
    baseline: `${formatNumber(baseline)} ${unit}`,
    comparison: `${formatNumber(comparison)} ${unit}`,
    delta: `${formatDelta(delta)} ${unit}`,
    deltaTone,
  };
}
