import {
  BenchmarkRunDetailResponse,
  formatDateTime,
  layerLabel,
  severityLabel,
  severityTone,
} from "@/entities/benchmark";
import { EmptyState } from "@/shared/ui/empty-state";
import { Panel } from "@/shared/ui/panel";
import { StatusPill } from "@/shared/ui/status-pill";

type RunBottleneckNotesPanelProps = {
  run: BenchmarkRunDetailResponse | null;
  isLoading?: boolean;
};

export function RunBottleneckNotesPanel({
  run,
  isLoading = false,
}: RunBottleneckNotesPanelProps) {
  return (
    <Panel className="notes-panel">
      <div className="panel-head">
        <div>
          <h3>병목 노트</h3>
          <p className="panel-copy">
            자동 분석 메모와 권장 후속 조치를 별도 패널에서 확인합니다.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="alert alert-info">병목 노트를 불러오는 중입니다.</div>
      ) : null}

      {run == null ? (
        <EmptyState
          title="선택된 Run이 없습니다."
          message="분석할 Run을 선택하면 병목 메모와 권장 조치가 표시됩니다."
        />
      ) : run.bottleneckNotes.length === 0 ? (
        <EmptyState
          title="등록된 병목 노트가 없습니다."
          message={
            run.benchmarkSummary?.recommendationText ??
            "분석 메모가 아직 생성되지 않았습니다."
          }
        />
      ) : (
        <div className="section-stack">
          {run.benchmarkSummary?.recommendationText ? (
            <div className="summary-callout">
              <span className="summary-callout-title">권장 조치</span>
              <strong>
                {run.benchmarkSummary.bottleneckLayer
                  ? layerLabel(run.benchmarkSummary.bottleneckLayer)
                  : "전체 흐름"}
              </strong>
              <p>{run.benchmarkSummary.recommendationText}</p>
            </div>
          ) : null}

          <div className="note-list">
            {run.bottleneckNotes.map((note, index) => (
              <article key={`${note.createdAt}-${index}`} className="note-card">
                <div className="note-head">
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
        </div>
      )}
    </Panel>
  );
}
