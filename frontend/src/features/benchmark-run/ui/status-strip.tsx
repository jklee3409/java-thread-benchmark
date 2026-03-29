import { threadModeLabel } from "@/entities/benchmark";

type StatusStripProps = {
  mode: string | undefined;
  runCount: number;
  selectedRunId: number | null;
  comparisonRunId: number | null;
  message: string;
  error: string;
};

export function StatusStrip({
  mode,
  runCount,
  selectedRunId,
  comparisonRunId,
  message,
  error,
}: StatusStripProps) {
  const statusMessage =
    error || message || "실험 대상을 확인한 뒤 실행 조건을 맞춰 테스트를 시작하세요.";

  return (
    <section className="status-strip" aria-live="polite">
      <div className="status-card">
        <span>현재 대상</span>
        <strong>{threadModeLabel(mode)}</strong>
      </div>
      <div className="status-card">
        <span>저장된 결과</span>
        <strong>{runCount}건</strong>
      </div>
      <div className="status-card">
        <span>선택한 결과</span>
        <strong>{selectedRunId == null ? "선택 안 됨" : `실험 #${selectedRunId}`}</strong>
      </div>
      <div className="status-card">
        <span>비교 대상</span>
        <strong>{comparisonRunId == null ? "선택 안 됨" : `실험 #${comparisonRunId}`}</strong>
      </div>
      <div className="status-card status-card--message">
        <span>{error ? "오류" : "상태"}</span>
        <strong>{error ? "확인이 필요합니다" : "다음 행동 안내"}</strong>
        <p className="status-message">{statusMessage}</p>
      </div>
    </section>
  );
}
