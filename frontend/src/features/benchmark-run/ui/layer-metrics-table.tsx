import { BenchmarkLayerMetricResponse, formatNumber } from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { Panel } from "@/shared/ui/panel";

type LayerMetricsTableProps = {
  metrics: BenchmarkLayerMetricResponse[];
};

export function LayerMetricsTable({ metrics }: LayerMetricsTableProps) {
  return (
    <Panel className="layer-panel">
      <div className="panel-head">
        <h2>Layer Metrics</h2>
        <span>{metrics.length} layers</span>
      </div>

      {metrics.length === 0 ? (
        <EmptyState message="No layer metrics have been recorded yet." />
      ) : (
        <table className="layer-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Count</th>
              <th>Error</th>
              <th>Timeout</th>
              <th>Avg ms</th>
              <th>P95 ms</th>
              <th>P99 ms</th>
              <th>Max ms</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.layer}>
                <td>{metric.layer}</td>
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
      )}
    </Panel>
  );
}
