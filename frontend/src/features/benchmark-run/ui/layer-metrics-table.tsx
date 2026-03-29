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
  isLoading?: boolean;
};

export function LayerMetricsTable({
  metrics,
  isLoading = false,
}: LayerMetricsTableProps) {
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
          <h3>레이어 메트릭</h3>
          <p className="panel-copy">
            애플리케이션 계층별 호출 수와 지연 분포를 비교합니다.
          </p>
        </div>
        <span className="panel-copy">{metrics.length}개 레이어</span>
      </div>

      {isLoading ? (
        <div className="alert alert-info">레이어 메트릭을 불러오는 중입니다.</div>
      ) : null}

      {metrics.length === 0 ? (
        <EmptyState
          title="레이어 메트릭이 없습니다."
          message="실행이 완료되면 DB, Redis, 외부 API 단계별 지표가 여기에 표시됩니다."
        />
      ) : (
        <div className="section-stack">
          <div className="metric-grid metric-grid--two">
            <MetricCard
              label="가장 느린 레이어"
              value={slowestMetric == null ? "-" : layerLabel(slowestMetric.layer)}
              helper={
                slowestMetric == null
                  ? "측정 데이터 없음"
                  : `p95 ${formatNumber(slowestMetric.p95LatencyMs)} ms`
              }
              tone="warning"
            />
            <MetricCard
              label="오류 또는 타임아웃"
              value={issueMetric == null ? "없음" : layerLabel(issueMetric.layer)}
              helper={
                issueMetric == null
                  ? "이상 징후 없음"
                  : `오류 ${issueMetric.errorCount}건 / 타임아웃 ${issueMetric.timeoutCount}건`
              }
              tone={issueMetric == null ? "success" : "danger"}
            />
          </div>

          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>레이어</th>
                  <th>호출 수</th>
                  <th>평균(ms)</th>
                  <th>p95(ms)</th>
                  <th>p99(ms)</th>
                  <th>최대(ms)</th>
                  <th>오류 수</th>
                  <th>타임아웃</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.layer}>
                    <td>{layerLabel(metric.layer)}</td>
                    <td>{metric.invocationCount}</td>
                    <td>{formatNumber(metric.averageLatencyMs)}</td>
                    <td>{formatNumber(metric.p95LatencyMs)}</td>
                    <td>{formatNumber(metric.p99LatencyMs)}</td>
                    <td>{formatNumber(metric.maxLatencyMs)}</td>
                    <td>{metric.errorCount}</td>
                    <td>{metric.timeoutCount}</td>
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
