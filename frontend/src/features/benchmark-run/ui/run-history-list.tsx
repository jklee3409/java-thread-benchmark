import {
  BenchmarkRunSummaryResponse,
  formatNumber,
  scenarioLabel,
} from "@/entities/benchmark";
import { cn } from "@/shared/lib/cn";
import { EmptyState } from "@/shared/ui/empty-state";
import { Panel } from "@/shared/ui/panel";

type RunHistoryListProps = {
  runs: BenchmarkRunSummaryResponse[];
  selectedRunId: number | null;
  onSelectRun: (runId: number) => void;
};

export function RunHistoryList({
  runs,
  selectedRunId,
  onSelectRun,
}: RunHistoryListProps) {
  return (
    <Panel className="list-panel">
      <div className="panel-head">
        <h2>Run History</h2>
        <span>{runs.length} runs</span>
      </div>

      <div className="run-list">
        {runs.length === 0 ? (
          <EmptyState message="No benchmark runs have been created yet." />
        ) : (
          runs.map((run) => (
            <button
              key={run.id}
              type="button"
              className={cn("run-item", selectedRunId === run.id && "selected")}
              onClick={() => onSelectRun(run.id)}
            >
              <div>
                <strong>#{run.id}</strong>
                <span>{run.mode}</span>
              </div>
              <div>
                <strong>{scenarioLabel(run.scenario)}</strong>
                <span>{run.status}</span>
              </div>
              <div>
                <strong>{formatNumber(run.throughput)} req/s</strong>
                <span>
                  p95 {formatNumber(run.p95LatencyMs)} ms / err {formatNumber(run.errorRate)}%
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </Panel>
  );
}
