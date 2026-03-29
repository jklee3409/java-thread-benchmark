"use client";

import { BenchmarkRunSummaryResponse } from "@/entities/benchmark";
import { RunHistoryList } from "@/features/benchmark-run";

type HistorySectionProps = {
  runs: BenchmarkRunSummaryResponse[];
  selectedRunId: number | null;
  onSelectRun: (runId: number) => void;
};

export function HistorySection({
  runs,
  selectedRunId,
  onSelectRun,
}: HistorySectionProps) {
  function handleSelectRun(runId: number) {
    onSelectRun(runId);

    requestAnimationFrame(() => {
      const resultSection = document.getElementById("results");
      if (resultSection instanceof HTMLElement) {
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        resultSection.focus();
      }
    });
  }

  return (
    <section className="dashboard-section" id="history">
      <div className="section-head">
        <div>
          <p className="section-label">이력</p>
          <h2>실행 이력을 관리합니다.</h2>
          <p className="section-subtitle">
            이전 결과를 다시 선택해 분석 탭과 비교 구간의 기준 Run으로 사용할 수 있습니다.
          </p>
        </div>
      </div>

      <RunHistoryList
        runs={runs}
        selectedRunId={selectedRunId}
        onSelectRun={handleSelectRun}
      />
    </section>
  );
}
