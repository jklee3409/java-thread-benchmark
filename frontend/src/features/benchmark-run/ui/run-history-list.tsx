import { KeyboardEvent } from "react";
import {
  BenchmarkRunSummaryResponse,
  formatDateTime,
  formatNumber,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { cn } from "@/shared/lib/cn";
import { EmptyState } from "@/shared/ui/empty-state";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

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
  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>, runId: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectRun(runId);
    }
  }

  return (
    <Panel className="history-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h3>실행 이력</h3>
          <p className="panel-copy">실험 결과를 표 형태로 정리해 다시 선택할 수 있습니다.</p>
        </div>
        <span className="panel-copy">총 {runs.length}건</span>
      </div>

      {runs.length === 0 ? (
        <EmptyState
          title="저장된 실행 이력이 없습니다."
          message="첫 실행이 완료되면 이 표에 Run이 누적됩니다."
        />
      ) : (
        <div className="table-shell">
          <table className="history-table">
            <thead>
              <tr>
                <th>실행 ID</th>
                <th>완료 시각</th>
                <th>Thread Mode</th>
                <th>시나리오</th>
                <th>Throughput</th>
                <th>p95 Latency</th>
                <th>Error Rate</th>
                <th>상태</th>
                <th>상세 보기</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr
                  key={run.id}
                  tabIndex={0}
                  className={cn(selectedRunId === run.id && "history-row-active")}
                  onClick={() => onSelectRun(run.id)}
                  onKeyDown={(event) => handleKeyDown(event, run.id)}
                >
                  <td>#{run.id}</td>
                  <td>{formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}</td>
                  <td>{threadModeLabel(run.mode)}</td>
                  <td>{scenarioLabel(run.scenario)}</td>
                  <td>{formatNumber(run.throughput)} req/s</td>
                  <td>{formatNumber(run.p95LatencyMs)} ms</td>
                  <td>{formatNumber(run.errorRate)} %</td>
                  <td>
                    <StatusPill tone={runStatusTone(run.status)}>
                      {runStatusLabel(run.status)}
                    </StatusPill>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="secondary history-action"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectRun(run.id);
                      }}
                    >
                      상세 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
