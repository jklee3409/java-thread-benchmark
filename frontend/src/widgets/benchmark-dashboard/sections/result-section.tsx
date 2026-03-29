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
  { id: "summary", label: "요약" },
  { id: "layers", label: "레이어 메트릭" },
  { id: "notes", label: "병목 노트" },
];

export function ResultSection({ run, isLoading, isPolling }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("summary");

  return (
    <section
      className="dashboard-section result-section-anchor"
      id="results"
      tabIndex={-1}
    >
      <div className="section-head">
        <div>
          <p className="section-label">결과</p>
          <h2>선택 Run을 상세 분석합니다.</h2>
          <p className="section-subtitle">
            요약, 레이어 메트릭, 병목 노트를 구분해 보고서처럼 검토할 수 있습니다.
          </p>
        </div>
      </div>

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
