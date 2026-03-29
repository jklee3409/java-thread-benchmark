import {
  BenchmarkRunDetailResponse,
  formatDateTime,
  formatNumber,
  layerLabel,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { InfoRow } from "@/shared/ui/info-row";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunDetailPanelProps = {
  run: BenchmarkRunDetailResponse | null;
  isLoading?: boolean;
  isPolling?: boolean;
};

export function RunDetailPanel({
  run,
  isLoading = false,
  isPolling = false,
}: RunDetailPanelProps) {
  const latestSnapshot = run?.metricSnapshots.at(-1);

  return (
    <Panel className="detail-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h3>요약 보고서</h3>
          <p className="panel-copy">
            선택 Run의 요청 결과, 실행 조건, 시스템 스냅샷을 함께 확인합니다.
          </p>
        </div>
        <div className="pill-row">
          {isPolling ? <StatusPill tone="warning">실시간 추적 중</StatusPill> : null}
          <StatusPill tone={run == null ? "neutral" : runStatusTone(run.status)}>
            {run == null ? "선택 없음" : runStatusLabel(run.status)}
          </StatusPill>
        </div>
      </div>

      {isLoading ? (
        <div className="alert alert-info">결과 보고서를 불러오는 중입니다.</div>
      ) : null}

      {run == null ? (
        <EmptyState
          title="선택된 Run이 없습니다."
          message="이력에서 Run을 선택하면 요청 결과와 병목 요약이 표시됩니다."
        />
      ) : (
        <div className="section-stack">
          <div className="summary-callout">
            <span className="summary-callout-title">요약</span>
            <strong>
              {scenarioLabel(run.scenario)} / {threadModeLabel(run.mode)}
            </strong>
            <p>
              {run.benchmarkSummary?.summaryText ??
                "요약 메시지가 아직 생성되지 않았습니다. 실행 완료 후 다시 확인하세요."}
            </p>
            <p className="panel-copy">
              주요 병목:{" "}
              {run.benchmarkSummary?.bottleneckLayer
                ? layerLabel(run.benchmarkSummary.bottleneckLayer)
                : "확인 중"}
            </p>
            {run.benchmarkSummary?.recommendationText ? (
              <p className="panel-copy">{run.benchmarkSummary.recommendationText}</p>
            ) : null}
          </div>

          <div className="metric-grid metric-grid--detail">
            <MetricCard label="총 요청" value={`${run.totalSamples}건`} helper="전체 샘플 수" />
            <MetricCard
              label="성공"
              value={`${run.successSamples}건`}
              helper="성공 처리 수"
              tone="success"
            />
            <MetricCard
              label="실패"
              value={`${run.errorSamples}건`}
              helper="오류 처리 수"
              tone={run.errorSamples > 0 ? "danger" : "neutral"}
            />
            <MetricCard
              label="평균 지연"
              value={`${formatNumber(run.averageLatencyMs)} ms`}
              helper="평균 응답 시간"
            />
            <MetricCard
              label="p95"
              value={`${formatNumber(run.p95LatencyMs)} ms`}
              helper="상위 5% 지연"
            />
            <MetricCard
              label="p99"
              value={`${formatNumber(run.p99LatencyMs)} ms`}
              helper="꼬리 지연"
            />
            <MetricCard
              label="처리량"
              value={`${formatNumber(run.throughput)} req/s`}
              helper="초당 처리량"
            />
            <MetricCard
              label="오류율"
              value={`${formatNumber(run.errorRate)} %`}
              helper="전체 요청 대비 실패 비율"
              tone={run.errorRate > 0 ? "danger" : "success"}
            />
          </div>

          <div className="detail-grid">
            <div className="detail-subpanel">
              <h4 className="detail-section-title">실험 구성</h4>
              <div className="info-table">
                <InfoRow label="실행 ID" value={`#${run.id}`} />
                <InfoRow label="스레드 모드" value={threadModeLabel(run.mode)} />
                <InfoRow label="시나리오" value={scenarioLabel(run.scenario)} />
                <InfoRow label="스레드 수" value={String(run.threadCount)} />
                <InfoRow label="램프업" value={`${run.rampUpSeconds}초`} />
                <InfoRow label="지속 시간" value={`${run.durationSeconds}초`} />
                <InfoRow label="반복 수" value={String(run.loopCount)} />
                <InfoRow label="DB 풀 크기" value={String(run.connectionPoolSize)} />
                <InfoRow
                  label="외부 API 지연"
                  value={run.externalDelayMs == null ? "-" : `${run.externalDelayMs} ms`}
                />
                <InfoRow
                  label="외부 API 응답 코드"
                  value={run.externalStatus == null ? "-" : String(run.externalStatus)}
                />
                <InfoRow label="샘플 ID" value={run.sampleId == null ? "-" : String(run.sampleId)} />
                <InfoRow
                  label="DB hold 시간"
                  value={run.dbHoldMs == null ? "-" : `${run.dbHoldMs} ms`}
                />
              </div>
            </div>

            <div className="detail-subpanel">
              <h4 className="detail-section-title">실행 메타데이터</h4>
              <div className="info-table">
                <InfoRow label="생성 시각" value={formatDateTime(run.createdAt)} />
                <InfoRow label="시작 시각" value={formatDateTime(run.startedAt)} />
                <InfoRow label="완료 시각" value={formatDateTime(run.completedAt)} />
                <InfoRow label="요청 경로" value={run.requestPath} mono />
                <InfoRow label="상관관계 ID" value={run.correlationId} mono />
                <InfoRow label="실패 메시지" value={run.failureMessage ?? "-"} />
                <InfoRow label="결과 CSV" value={run.resultFilePath ?? "-"} mono />
                <InfoRow label="JMeter 로그" value={run.jmeterLogPath ?? "-"} mono />
                <InfoRow label="프로세스 출력" value={run.processOutputPath ?? "-"} mono />
              </div>
            </div>
          </div>

          {latestSnapshot ? (
            <div className="detail-subpanel">
              <h4 className="detail-section-title">최신 시스템 스냅샷</h4>
              <div className="metric-grid metric-grid--snapshot">
                <MetricCard
                  label="활성 커넥션"
                  value={String(latestSnapshot.activeConnections)}
                  helper="사용 중인 DB 커넥션"
                />
                <MetricCard
                  label="대기 커넥션"
                  value={String(latestSnapshot.pendingConnections)}
                  helper="풀 반환 대기"
                  tone={latestSnapshot.pendingConnections > 0 ? "warning" : "neutral"}
                />
                <MetricCard
                  label="전체 커넥션"
                  value={String(latestSnapshot.totalConnections)}
                  helper="풀 전체 크기"
                />
                <MetricCard
                  label="라이브 스레드"
                  value={String(latestSnapshot.liveThreads)}
                  helper="JVM 현재 스레드 수"
                />
                <MetricCard
                  label="피크 스레드"
                  value={String(latestSnapshot.peakThreads)}
                  helper="실행 중 최댓값"
                />
                <MetricCard
                  label="총 시작 스레드"
                  value={String(latestSnapshot.totalStartedThreads)}
                  helper="누적 생성량"
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Panel>
  );
}
