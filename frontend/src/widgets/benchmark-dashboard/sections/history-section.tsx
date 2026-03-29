"use client";

import { BenchmarkRunSummaryResponse } from "@/entities/benchmark";
import { RunHistoryList } from "@/features/benchmark-run";

type HistorySectionProps = {
  runs: BenchmarkRunSummaryResponse[];
  selectedRunId: number | null;
  onSelectRun: (runId: number) => void;
  onOpenResults?: () => void;
};

export function HistorySection({
  runs,
  selectedRunId,
  onSelectRun,
  onOpenResults,
}: HistorySectionProps) {
  function handleSelectRun(runId: number) {
    onSelectRun(runId);

    if (onOpenResults) {
      onOpenResults();
      return;
    }

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
      <RunHistoryList
        runs={runs}
        selectedRunId={selectedRunId}
        onSelectRun={handleSelectRun}
      />
    </section>
  );
}
