import { threadModeLabel } from "@/entities/benchmark";

type StatusStripProps = {
  mode: string | undefined;
  runCount: number;
  selectedRunId: number | null;
  comparisonRunId: number | null;
};

export function StatusStrip({
  mode,
  runCount,
  selectedRunId,
  comparisonRunId,
}: StatusStripProps) {
  return (
    <section className="status-strip" aria-label="실험 상태 요약">
      <div className="status-card">
        <span className="status-card-label">현재 대상</span>
        <strong className="status-card-value">{threadModeLabel(mode)}</strong>
      </div>
      <div className="status-card">
        <span className="status-card-label">총 실행 수</span>
        <strong className="status-card-value">{runCount}건</strong>
      </div>
      <div className="status-card">
        <span className="status-card-label">선택 Run ID</span>
        <strong className="status-card-value">
          {selectedRunId == null ? "-" : `#${selectedRunId}`}
        </strong>
      </div>
      <div className="status-card">
        <span className="status-card-label">비교 Run ID</span>
        <strong className="status-card-value">
          {comparisonRunId == null ? "-" : `#${comparisonRunId}`}
        </strong>
      </div>
    </section>
  );
}
