"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Scenario, threadModeLabel } from "@/entities/benchmark";
import {
  LayerMetricsTable,
  RunConfigForm,
  RunComparisonPanel,
  RunDetailPanel,
  RunHistoryList,
  StatusStrip,
  TargetConnectionPanel,
  useBenchmarkDashboard,
} from "@/features/benchmark-run";
import {
  getGrafanaDashboardUrl,
  GrafanaEmbedPanel,
  ObservabilityLinksPanel,
} from "@/features/monitoring";
import { SiteHeader } from "@/shared/ui/site-header";

export function BenchmarkDashboard() {
  const dashboard = useBenchmarkDashboard();
  const searchParams = useSearchParams();
  const requestedRunId = parseRunId(searchParams.get("runId"));
  const requestedComparisonRunId = parseRunId(searchParams.get("compareRunId"));
  const currentModeLabel = threadModeLabel(dashboard.options?.currentMode);

  useEffect(() => {
    if (
      requestedRunId != null &&
      requestedRunId !== dashboard.selectedRunId &&
      dashboard.runs.some((run) => run.id === requestedRunId)
    ) {
      dashboard.setSelectedRunId(requestedRunId);
    }
  }, [dashboard.runs, dashboard.selectedRunId, dashboard.setSelectedRunId, requestedRunId]);

  useEffect(() => {
    if (
      requestedComparisonRunId != null &&
      requestedComparisonRunId !== dashboard.comparisonRunId &&
      dashboard.runs.some((run) => run.id === requestedComparisonRunId)
    ) {
      dashboard.setComparisonRunId(requestedComparisonRunId);
    }
  }, [
    dashboard.comparisonRunId,
    dashboard.runs,
    dashboard.setComparisonRunId,
    requestedComparisonRunId,
  ]);

  const workflowCards = [
    {
      label: "실험 설정",
      title: `${currentModeLabel} 대상으로 준비`,
      description:
        "연결할 백엔드를 고르고, 같은 비교 조건으로 실행할 기본 부하를 맞춥니다.",
      href: "#setup",
      action: "설정 열기",
    },
    {
      label: "실험 실행",
      title: dashboard.error ? "오류를 확인한 뒤 다시 실행" : "부하 테스트 실행",
      description:
        dashboard.error ||
        "실행 버튼을 누르면 최근 결과와 상태가 자동으로 갱신됩니다.",
      href: "#execute",
      action: "실행으로 이동",
    },
    {
      label: "결과 분석",
      title:
        dashboard.selectedRun == null
          ? "최근 결과를 선택하세요"
          : `실험 #${dashboard.selectedRun.id} 결과 분석`,
      description:
        dashboard.selectedRun == null
          ? "최근 결과 목록에서 하나를 선택하면 아래 요약과 비교 패널이 함께 바뀝니다."
          : "핵심 지표, 레이어 병목, 비교 결과, Grafana 흐름을 순서대로 확인합니다.",
      href: "#results",
      action: "결과 보기",
    },
  ];

  return (
    <main className="dashboard-shell">
      <SiteHeader current="dashboard" />

      <section className="workspace-hero">
        <div className="hero-copy">
          <p className="eyebrow">실험 워크스페이스</p>
          <h1>실험을 실행하고 결과를 바로 비교하세요</h1>
          <p className="subtitle">
            어디서 실험을 시작하는지, 결과를 어디서 보는지, 비교는 어디서 하는지 한 화면 안에서
            끊기지 않도록 재구성했습니다.
          </p>
          <div className="hero-actions">
            <a href="#setup" className="primary hero-action">
              실험 시작하기
            </a>
            <a href="#history" className="secondary hero-action">
              최근 결과 보기
            </a>
            <a
              href={getGrafanaDashboardUrl()}
              target="_blank"
              rel="noreferrer"
              className="secondary hero-action"
            >
              대시보드 보기
            </a>
          </div>
        </div>

        <aside className="workspace-summary">
          <div className="panel-head panel-head--spread">
            <div>
              <p className="section-label">작업 요약</p>
              <h2>지금 필요한 정보만 먼저 보여줍니다</h2>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span>현재 대상</span>
              <strong>{currentModeLabel}</strong>
              <p>실행과 결과 조회가 이 대상으로 연결됩니다.</p>
            </div>
            <div className="summary-item">
              <span>선택 결과</span>
              <strong>
                {dashboard.selectedRunId == null ? "선택 없음" : `실험 #${dashboard.selectedRunId}`}
              </strong>
              <p>결과 요약과 비교 패널의 기준이 됩니다.</p>
            </div>
            <div className="summary-item">
              <span>비교 대상</span>
              <strong>
                {dashboard.comparisonRunId == null
                  ? "비교 안 함"
                  : `실험 #${dashboard.comparisonRunId}`}
              </strong>
              <p>차이는 항상 비교 대상 기준으로 계산합니다.</p>
            </div>
            <div className="summary-item">
              <span>저장된 결과</span>
              <strong>{dashboard.runs.length}건</strong>
              <p>최근 결과는 화면 하단 목록에서 다시 고를 수 있습니다.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="workflow-grid workflow-grid--compact">
        {workflowCards.map((card) => (
          <a key={card.title} href={card.href} className="workflow-card workflow-card--interactive">
            <div className="workflow-head">
              <span>{card.label}</span>
              <strong>{card.title}</strong>
            </div>
            <p>{card.description}</p>
            <span className="flow-link">{card.action}</span>
          </a>
        ))}
      </section>

      <StatusStrip
        mode={dashboard.options?.currentMode}
        runCount={dashboard.runs.length}
        selectedRunId={dashboard.selectedRunId}
        comparisonRunId={dashboard.comparisonRunId}
        message={dashboard.message}
        error={dashboard.error}
      />

      <section className="workspace-block" id="setup">
        <div className="block-head">
          <p className="section-label">실험 설정</p>
          <h2>대상을 고르고 비교 조건을 맞춘 뒤 실행하세요</h2>
        </div>

        <div className="setup-grid">
          <TargetConnectionPanel
            apiBaseUrl={dashboard.apiBaseUrl}
            presetTargets={dashboard.presetTargets}
            onApiBaseUrlChange={dashboard.setApiBaseUrl}
            onRefreshConnection={() => void dashboard.refreshConnection()}
            onReloadRuns={() => void dashboard.refreshRuns()}
          />
          <RunConfigForm
            form={dashboard.form}
            scenarios={dashboard.options?.scenarios ?? (["mixed"] as Scenario[])}
            isPending={dashboard.isPending}
            onFieldChange={(field, value) =>
              dashboard.setForm((current) => ({ ...current, [field]: value }))
            }
            onSubmit={dashboard.submitRun}
          />
        </div>
      </section>

      <section className="workspace-block" id="results">
        <div className="block-head">
          <p className="section-label">결과 분석</p>
          <h2>핵심 지표를 먼저 보고 상세 병목으로 내려갑니다</h2>
        </div>

        <div className="analysis-grid">
          <RunDetailPanel run={dashboard.selectedRun} />
          <LayerMetricsTable metrics={dashboard.selectedRun?.layerMetrics ?? []} />
        </div>
      </section>

      <section className="workspace-block" id="compare">
        <div className="block-head">
          <p className="section-label">비교와 모니터링</p>
          <h2>차이를 바로 보고, 필요할 때 실시간 대시보드로 내려갑니다</h2>
        </div>

        <div className="comparison-layout">
          <RunComparisonPanel
            runs={dashboard.runs}
            baselineRun={dashboard.selectedRun}
            comparisonRun={dashboard.comparisonRun}
            comparisonRunId={dashboard.comparisonRunId}
            onComparisonRunIdChange={dashboard.setComparisonRunId}
          />
          <div className="monitoring-stack">
            <ObservabilityLinksPanel />
            <GrafanaEmbedPanel />
          </div>
        </div>
      </section>

      <section className="workspace-block" id="history">
        <div className="block-head">
          <p className="section-label">최근 실험 결과</p>
          <h2>이전 결과를 다시 선택해 요약과 비교 기준을 바꿀 수 있습니다</h2>
        </div>

        <RunHistoryList
          runs={dashboard.runs}
          selectedRunId={dashboard.selectedRunId}
          onSelectRun={dashboard.setSelectedRunId}
        />
      </section>
    </main>
  );
}

function parseRunId(value: string | null): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}
