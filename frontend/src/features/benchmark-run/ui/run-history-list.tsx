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
  return (
    <Panel className="list-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>최근 실험 결과</h2>
          <p className="panel-copy">
            결과 하나를 고르면 위의 요약, 비교, 모니터링 패널이 함께 바뀝니다.
          </p>
        </div>
        <span>{runs.length}건</span>
      </div>

      <div className="run-list">
        {runs.length === 0 ? (
          <EmptyState
            title="아직 저장된 실험 결과가 없습니다."
            message="실험을 실행하면 이 목록에 쌓이고, 선택 즉시 결과 분석 영역이 업데이트됩니다."
          />
        ) : (
          runs.map((run) => (
            <button
              key={run.id}
              type="button"
              className={cn("run-item", selectedRunId === run.id && "selected")}
              onClick={() => onSelectRun(run.id)}
            >
              <div className="run-item-top">
                <div>
                  <strong>실험 #{run.id}</strong>
                  <p className="run-item-time">
                    {formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}
                  </p>
                </div>
                <StatusPill tone={runStatusTone(run.status)}>
                  {runStatusLabel(run.status)}
                </StatusPill>
              </div>

              <div className="run-item-grid">
                <div>
                  <span>스레드 방식</span>
                  <strong>{threadModeLabel(run.mode)}</strong>
                </div>
                <div>
                  <span>시나리오</span>
                  <strong>{scenarioLabel(run.scenario)}</strong>
                </div>
                <div>
                  <span>처리량</span>
                  <strong>{formatNumber(run.throughput)} req/s</strong>
                </div>
                <div>
                  <span>P95 / 오류율</span>
                  <strong>
                    {formatNumber(run.p95LatencyMs)} ms / {formatNumber(run.errorRate)}%
                  </strong>
                </div>
              </div>

              <div className="run-item-footer">
                <span>스레드 {run.threadCount}</span>
                <span>실행 시간 {run.durationSeconds}초</span>
                <span>샘플 {run.totalSamples}건</span>
                <span>{selectedRunId === run.id ? "현재 분석 중" : "클릭해 결과 보기"}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </Panel>
  );
}
