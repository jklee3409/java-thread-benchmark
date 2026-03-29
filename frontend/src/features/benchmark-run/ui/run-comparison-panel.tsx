import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
  formatDelta,
  formatNumber,
  layerLabel,
  scenarioLabel,
  threadModeLabel,
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
    <Panel className="comparison-panel" id="comparison-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>결과 비교</h2>
          <p className="panel-copy">
            기준 결과를 고른 뒤 비교 대상을 선택하면 차이만 바로 확인할 수 있습니다.
          </p>
        </div>

        <label className="field field--compact">
          <span>비교할 결과</span>
          <select
            value={comparisonRunId ?? ""}
            onChange={(event) =>
              onComparisonRunIdChange(
                event.target.value ? Number(event.target.value) : null,
              )
            }
          >
            <option value="">비교 안 함</option>
            {comparisonCandidates.map((run) => (
              <option key={run.id} value={run.id}>
                #{run.id} {threadModeLabel(run.mode)} · {scenarioLabel(run.scenario)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {baselineRun == null || comparisonRun == null ? (
        <EmptyState
          title="비교할 두 실험을 아직 고르지 않았습니다."
          message="기준 결과를 먼저 선택한 뒤, 오른쪽 선택 상자에서 비교 대상을 고르면 차이가 계산됩니다."
        />
      ) : (
        <div className="comparison-content">
          <p className="comparison-note">모든 차이는 `비교 대상 - 기준 결과` 기준으로 계산합니다.</p>
          <div className="comparison-highlight">
            <strong>
              {comparisonRun.throughput >= baselineRun.throughput
                ? "비교 대상이 더 많은 요청을 처리합니다."
                : "기준 결과가 더 높은 처리량을 보입니다."}
            </strong>
            <p>처리량만 보지 말고 지연 시간과 오류율도 함께 확인하세요.</p>
          </div>

          <div className="comparison-header">
            <div className="comparison-run">
              <span>기준 결과</span>
              <strong>실험 #{baselineRun.id}</strong>
              <p>
                {threadModeLabel(baselineRun.mode)} · {scenarioLabel(baselineRun.scenario)}
              </p>
            </div>
            <div className="comparison-run">
              <span>비교 대상</span>
              <strong>실험 #{comparisonRun.id}</strong>
              <p>
                {threadModeLabel(comparisonRun.mode)} · {scenarioLabel(comparisonRun.scenario)}
              </p>
            </div>
          </div>

          <div className="metric-grid metric-grid--comparison">
            <MetricCard
              label="처리량 차이"
              value={`${formatDelta(comparisonRun.throughput - baselineRun.throughput)} req/s`}
              helper="양수면 비교 대상이 더 많이 처리"
              tone={comparisonRun.throughput >= baselineRun.throughput ? "success" : "danger"}
            />
            <MetricCard
              label="P95 차이"
              value={`${formatDelta(comparisonRun.p95LatencyMs - baselineRun.p95LatencyMs)} ms`}
              helper="음수면 비교 대상이 더 빠름"
              tone={
                comparisonRun.p95LatencyMs <= baselineRun.p95LatencyMs ? "success" : "danger"
              }
            />
            <MetricCard
              label="P99 차이"
              value={`${formatDelta(comparisonRun.p99LatencyMs - baselineRun.p99LatencyMs)} ms`}
              helper="꼬리 지연 비교"
              tone={
                comparisonRun.p99LatencyMs <= baselineRun.p99LatencyMs ? "success" : "danger"
              }
            />
            <MetricCard
              label="오류율 차이"
              value={`${formatDelta(comparisonRun.errorRate - baselineRun.errorRate)} %`}
              helper="음수면 비교 대상 오류율이 낮음"
              tone={comparisonRun.errorRate <= baselineRun.errorRate ? "success" : "danger"}
            />
          </div>

          <div className="comparison-table">
            <div className="comparison-row">
              <span>동시 사용자 수</span>
              <strong>{baselineRun.threadCount}</strong>
              <strong>{comparisonRun.threadCount}</strong>
            </div>
            <div className="comparison-row">
              <span>DB 풀 크기</span>
              <strong>{baselineRun.connectionPoolSize}</strong>
              <strong>{comparisonRun.connectionPoolSize}</strong>
            </div>
            <div className="comparison-row">
              <span>최근 DB 대기 수</span>
              <strong>{latestPendingConnections(baselineRun)}</strong>
              <strong>{latestPendingConnections(comparisonRun)}</strong>
            </div>
            <div className="comparison-row">
              <span>주요 병목 레이어</span>
              <strong>
                {baselineRun.benchmarkSummary?.bottleneckLayer
                  ? layerLabel(baselineRun.benchmarkSummary.bottleneckLayer)
                  : "-"}
              </strong>
              <strong>
                {comparisonRun.benchmarkSummary?.bottleneckLayer
                  ? layerLabel(comparisonRun.benchmarkSummary.bottleneckLayer)
                  : "-"}
              </strong>
            </div>
            <div className="comparison-row">
              <span>요약</span>
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
  return run.benchmarkSummary.summaryText.length > 120
    ? `${run.benchmarkSummary.summaryText.slice(0, 120)}...`
    : run.benchmarkSummary.summaryText;
}
