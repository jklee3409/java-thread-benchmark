import {
  BenchmarkRunDetailResponse,
  BenchmarkRunSummaryResponse,
  formatDateTime,
  formatNumber,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type ExecutionSectionProps = {
  run: BenchmarkRunDetailResponse | BenchmarkRunSummaryResponse | null;
  isLoading: boolean;
  isPolling: boolean;
  isSubmitting: boolean;
  isRefreshingRuns: boolean;
  message: string;
  error: string;
};

export function ExecutionSection({
  run,
  isLoading,
  isPolling,
  isSubmitting,
  isRefreshingRuns,
  message,
  error,
}: ExecutionSectionProps) {
  const stateTone = error
    ? "danger"
    : isSubmitting || isRefreshingRuns || isPolling
      ? "warning"
      : run == null
        ? "neutral"
        : runStatusTone(run.status);

  const stateLabel = error
    ? "확인 필요"
    : isSubmitting
      ? "실행 요청 중"
      : isRefreshingRuns
        ? "이력 갱신 중"
        : isPolling
          ? "실시간 추적 중"
          : run == null
            ? "대기"
            : runStatusLabel(run.status);

  return (
    <section className="dashboard-section" id="execution">
      <div className="section-head">
        <div>
          <p className="section-label">실행</p>
          <h2>실행 상태와 핵심 지표를 확인합니다.</h2>
          <p className="section-subtitle">
            실행 요청 이후 상태 변화와 최근 선택 Run의 요약 지표를 즉시 확인합니다.
          </p>
        </div>
      </div>

      <div className="execution-layout">
        <Panel className="state-panel">
          <div className="panel-head panel-head--spread">
            <div>
              <h3>실행 상태</h3>
              <p className="panel-copy">실행 메시지와 오류를 이 구역에서 확인합니다.</p>
            </div>
            <StatusPill tone={stateTone}>{stateLabel}</StatusPill>
          </div>

          <div className="state-stack">
            <div className="state-item">
              <span className="state-item-label">선택 Run</span>
              <strong className="state-item-value">
                {run == null ? "-" : `#${run.id}`}
              </strong>
            </div>
            <div className="state-item">
              <span className="state-item-label">대상 / 시나리오</span>
              <strong className="state-item-value">
                {run == null
                  ? "실행 전"
                  : `${threadModeLabel(run.mode)} / ${scenarioLabel(run.scenario)}`}
              </strong>
            </div>
            <div className="state-item">
              <span className="state-item-label">최근 시각</span>
              <strong className="state-item-value">
                {run == null
                  ? "-"
                  : formatDateTime(run.completedAt ?? run.startedAt ?? run.createdAt)}
              </strong>
            </div>
          </div>

          {isLoading ? (
            <div className="alert alert-info">실행 데이터를 불러오는 중입니다.</div>
          ) : null}

          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="alert alert-info">
              {message || "실험 설정 후 부하 테스트를 실행하세요."}
            </div>
          )}
        </Panel>

        <Panel className="state-panel">
          <div className="panel-head">
            <div>
              <h3>최근 요약</h3>
              <p className="panel-copy">처리량과 지연 지표를 우선 확인합니다.</p>
            </div>
          </div>

          {run == null ? (
            <EmptyState
              title="선택된 실행이 없습니다."
              message="설정을 저장한 뒤 실행하거나 이력에서 Run을 선택하면 요약 지표가 표시됩니다."
            />
          ) : (
            <>
              <div className="metric-grid metric-grid--four">
                <MetricCard
                  label="TPS"
                  value={`${formatNumber(run.throughput)} req/s`}
                  helper="초당 처리량"
                />
                <MetricCard
                  label="p95 지연"
                  value={`${formatNumber(run.p95LatencyMs)} ms`}
                  helper="상위 5% 지연"
                />
                <MetricCard
                  label="p99 지연"
                  value={`${formatNumber(run.p99LatencyMs)} ms`}
                  helper="꼬리 지연"
                />
                <MetricCard
                  label="오류율"
                  value={`${formatNumber(run.errorRate)} %`}
                  helper="전체 요청 대비 실패 비율"
                  tone={run.errorRate > 0 ? "danger" : "success"}
                />
              </div>

              <div className="summary-meta">
                <span>총 요청 {run.totalSamples}건</span>
                <span>스레드 수 {run.threadCount}</span>
                <span>지속 시간 {run.durationSeconds}초</span>
              </div>
            </>
          )}
        </Panel>
      </div>
    </section>
  );
}
