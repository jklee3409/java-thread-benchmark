import {
  BenchmarkLayerMetricResponse,
  formatNumber,
  layerLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";

type LayerMetricsTableProps = {
  metrics: BenchmarkLayerMetricResponse[];
};

export function LayerMetricsTable({ metrics }: LayerMetricsTableProps) {
  const slowestMetric = metrics.reduce<BenchmarkLayerMetricResponse | null>((candidate, metric) => {
    if (candidate == null || metric.p95LatencyMs > candidate.p95LatencyMs) {
      return metric;
    }
    return candidate;
  }, null);
  const issueMetric =
    metrics.find((metric) => metric.timeoutCount > 0 || metric.errorCount > 0) ?? null;

  return (
    <Panel className="layer-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>레이어별 병목 분석</h2>
          <p className="panel-copy">
            요약 지표 뒤에 숨어 있는 느린 레이어를 여기서 구분해서 봅니다.
          </p>
        </div>
        <span>{metrics.length}개 레이어</span>
      </div>

      {metrics.length === 0 ? (
        <EmptyState
          title="레이어별 지표가 아직 없습니다."
          message="실험이 실행되면 DB, Redis, 외부 API 단위의 지연 시간과 오류 수가 이 표에 채워집니다."
        />
      ) : (
        <>
          <div className="metric-grid metric-grid--layers">
            <MetricCard
              label="가장 느린 레이어"
              value={slowestMetric == null ? "-" : layerLabel(slowestMetric.layer)}
              helper={
                slowestMetric == null
                  ? "아직 측정값이 없습니다."
                  : `P95 ${formatNumber(slowestMetric.p95LatencyMs)} ms`
              }
              tone="accent"
            />
            <MetricCard
              label="오류 또는 타임아웃"
              value={issueMetric == null ? "안정적" : layerLabel(issueMetric.layer)}
              helper={
                issueMetric == null
                  ? "즉시 확인이 필요한 오류가 없습니다."
                  : `오류 ${issueMetric.errorCount}건 · 타임아웃 ${issueMetric.timeoutCount}건`
              }
              tone={issueMetric == null ? "success" : "danger"}
            />
          </div>

          <div className="table-shell">
            <table className="layer-table">
              <thead>
                <tr>
                  <th>레이어</th>
                  <th>호출 수</th>
                  <th>오류 수</th>
                  <th>타임아웃</th>
                  <th>평균(ms)</th>
                  <th>P95(ms)</th>
                  <th>P99(ms)</th>
                  <th>최대(ms)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.layer}>
                    <td>{layerLabel(metric.layer)}</td>
                    <td>{metric.invocationCount}</td>
                    <td>{metric.errorCount}</td>
                    <td>{metric.timeoutCount}</td>
                    <td>{formatNumber(metric.averageLatencyMs)}</td>
                    <td>{formatNumber(metric.p95LatencyMs)}</td>
                    <td>{formatNumber(metric.p99LatencyMs)}</td>
                    <td>{formatNumber(metric.maxLatencyMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}
