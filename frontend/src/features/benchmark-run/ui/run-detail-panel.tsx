import {
  BenchmarkRunDetailResponse,
  formatDateTime,
  formatNumber,
  layerLabel,
  runStatusLabel,
  runStatusTone,
  scenarioLabel,
  severityLabel,
  severityTone,
  threadModeLabel,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { InfoRow } from "@/shared/ui/info-row";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunDetailPanelProps = {
  run: BenchmarkRunDetailResponse | null;
};

export function RunDetailPanel({ run }: RunDetailPanelProps) {
  const latestSnapshot = run?.metricSnapshots.at(-1);
  const recommendationText =
    run?.benchmarkSummary?.recommendationText ??
    "레이어별 지표와 비교 패널을 함께 보면서 병목 원인을 좁혀보세요.";

  return (
    <Panel className="detail-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>선택한 결과 요약</h2>
          <p className="panel-copy">
            요약을 먼저 보고, 아래에서 설정과 런타임 상태, 병목 메모를 확인하세요.
          </p>
        </div>
        <StatusPill tone={run == null ? "neutral" : runStatusTone(run.status)}>
          {run == null ? "선택 없음" : runStatusLabel(run.status)}
        </StatusPill>
      </div>

      {run == null ? (
        <EmptyState
          title="선택한 실험 결과가 없습니다."
          message="최근 실험 목록에서 결과 하나를 선택하면 처리량, 지연 시간, 병목 요약이 이 영역에 표시됩니다."
        />
      ) : (
        <div className="detail-content">
          <div className="result-summary-banner">
            <div className="summary-item">
              <span>선택 결과</span>
              <strong>
                실험 #{run.id} · {threadModeLabel(run.mode)}
              </strong>
              <p>{scenarioLabel(run.scenario)}</p>
            </div>
            <div className="summary-item">
              <span>주요 병목</span>
              <strong>
                {run.benchmarkSummary?.bottleneckLayer
                  ? layerLabel(run.benchmarkSummary.bottleneckLayer)
                  : "판별 전"}
              </strong>
              <p>가장 먼저 확인할 레이어입니다.</p>
            </div>
            <div className="summary-item">
              <span>다음 확인</span>
              <strong>{shortText(recommendationText, 96)}</strong>
              <p>아래 상세 정보와 함께 판단하세요.</p>
            </div>
          </div>

          <div className="metric-grid">
            <MetricCard
              label="처리량"
              value={`${formatNumber(run.throughput)} req/s`}
              helper="초당 처리 요청 수"
            />
            <MetricCard
              label="평균 응답 시간"
              value={`${formatNumber(run.averageLatencyMs)} ms`}
              helper="전체 요청 평균"
            />
            <MetricCard
              label="P95"
              value={`${formatNumber(run.p95LatencyMs)} ms`}
              helper="상위 5% 느린 요청 기준"
            />
            <MetricCard
              label="P99"
              value={`${formatNumber(run.p99LatencyMs)} ms`}
              helper="꼬리 지연 확인"
            />
            <MetricCard
              label="오류율"
              value={`${formatNumber(run.errorRate)} %`}
              helper="실패 요청 비율"
              tone={run.errorRate > 0 ? "danger" : "success"}
            />
            <MetricCard
              label="성공 샘플"
              value={`${run.successSamples}건`}
              helper={`전체 ${run.totalSamples}건 중`}
            />
          </div>

          <div className="callout-block">
            <h3>결과 요약</h3>
            <p>
              {run.benchmarkSummary?.summaryText ??
                "아직 요약 정보가 없습니다. 실험이 끝나면 병목 요약이 여기에 표시됩니다."}
            </p>
            <p className="callout-subtle">
              주요 병목 레이어:{" "}
              {run.benchmarkSummary?.bottleneckLayer
                ? layerLabel(run.benchmarkSummary.bottleneckLayer)
                : "판별 전"}
            </p>
            <p className="callout-subtle">{recommendationText}</p>
          </div>

          <div className="detail-section">
            <h3>실험 조건</h3>
            <div className="kv-table">
              <InfoRow label="시나리오" value={scenarioLabel(run.scenario)} />
              <InfoRow label="스레드 방식" value={threadModeLabel(run.mode)} />
              <InfoRow label="동시 사용자 수" value={String(run.threadCount)} />
              <InfoRow label="램프업" value={`${run.rampUpSeconds}초`} />
              <InfoRow label="실행 시간" value={`${run.durationSeconds}초`} />
              <InfoRow label="반복 횟수" value={String(run.loopCount)} />
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

          <div className="detail-section">
            <h3>실행 정보</h3>
            <div className="kv-table">
              <InfoRow label="생성 시각" value={formatDateTime(run.createdAt)} />
              <InfoRow label="시작 시각" value={formatDateTime(run.startedAt)} />
              <InfoRow label="완료 시각" value={formatDateTime(run.completedAt)} />
              <InfoRow label="요청 경로" value={run.requestPath} mono />
              <InfoRow label="상관관계 ID" value={run.correlationId} mono />
              <InfoRow
                label="실패 메시지"
                value={run.failureMessage ?? "기록된 실패 메시지 없음"}
                mono
              />
            </div>
          </div>

          {latestSnapshot ? (
            <div className="detail-section">
              <h3>최신 런타임 스냅샷</h3>
              <div className="metric-grid metric-grid--snapshot">
                <MetricCard
                  label="활성 커넥션"
                  value={String(latestSnapshot.activeConnections)}
                  helper="현재 사용 중인 DB 커넥션"
                />
                <MetricCard
                  label="유휴 커넥션"
                  value={String(latestSnapshot.idleConnections)}
                  helper="즉시 재사용 가능한 커넥션"
                />
                <MetricCard
                  label="대기 중 커넥션"
                  value={String(latestSnapshot.pendingConnections)}
                  helper="풀 반납을 기다리는 요청 수"
                  tone={latestSnapshot.pendingConnections > 0 ? "danger" : "neutral"}
                />
                <MetricCard
                  label="전체 커넥션"
                  value={String(latestSnapshot.totalConnections)}
                  helper="스냅샷 기준 풀 크기"
                />
                <MetricCard
                  label="라이브 스레드"
                  value={String(latestSnapshot.liveThreads)}
                  helper="JVM 현재 스레드 수"
                />
                <MetricCard
                  label="최대 피크 스레드"
                  value={String(latestSnapshot.peakThreads)}
                  helper="실행 중 관측된 최대값"
                />
              </div>
            </div>
          ) : null}

          <div className="detail-section">
            <h3>실행 산출물</h3>
            <div className="kv-table">
              <InfoRow label="결과 CSV" value={run.resultFilePath ?? "-"} mono />
              <InfoRow label="JMeter 로그" value={run.jmeterLogPath ?? "-"} mono />
              <InfoRow label="프로세스 출력" value={run.processOutputPath ?? "-"} mono />
            </div>
          </div>

          <div className="notes-block">
            <h3>병목 메모</h3>
            {run.bottleneckNotes.length === 0 ? (
              <EmptyState
                title="생성된 병목 메모가 없습니다."
                message="레이어별 분석 결과가 저장되면 병목 메모가 이곳에 표시됩니다."
              />
            ) : (
              <div className="note-list">
                {run.bottleneckNotes.map((note, index) => (
                  <article key={`${note.createdAt}-${index}`} className="note-card">
                    <div className="note-card-head">
                      <StatusPill tone={severityTone(note.severity)}>
                        {severityLabel(note.severity)}
                      </StatusPill>
                      <strong>{note.layer ? layerLabel(note.layer) : "전체 흐름"}</strong>
                    </div>
                    <p>{note.message}</p>
                    <span className="note-meta">{formatDateTime(note.createdAt)}</span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

function shortText(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}
