"use client";

import { useState } from "react";
import {
  RunBottleneckNotesPanel,
  LayerMetricsTable,
  RunDetailPanel,
} from "@/features/benchmark-run";
import { BenchmarkRunDetailResponse } from "@/entities/benchmark";

type ResultSectionProps = {
  run: BenchmarkRunDetailResponse | null;
  isLoading: boolean;
  isPolling: boolean;
};

type ResultTab = "summary" | "layers" | "notes";

const TABS: Array<{
  id: ResultTab;
  label: string;
}> = [
  { id: "summary", label: "Summary" },
  { id: "layers", label: "Layers" },
  { id: "notes", label: "Notes" },
];

export function ResultSection({ run, isLoading, isPolling }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("summary");

  return (
    <section className="dashboard-section result-section-anchor" id="results" tabIndex={-1}>
      <div className="result-tabs" role="tablist" aria-label="결과 분석 탭">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "tab-button tab-button-active" : "tab-button"}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="result-body">
        {activeTab === "summary" ? (
          <RunDetailPanel run={run} isLoading={isLoading} isPolling={isPolling} />
        ) : null}
        {activeTab === "layers" ? (
          <LayerMetricsTable metrics={run?.layerMetrics ?? []} isLoading={isLoading} />
        ) : null}
        {activeTab === "notes" ? (
          <RunBottleneckNotesPanel run={run} isLoading={isLoading} />
        ) : null}
      </div>
    </section>
  );
}
