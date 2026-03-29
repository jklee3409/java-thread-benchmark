"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BenchmarkRunSummaryResponse,
  Scenario,
} from "@/entities/benchmark";
import {
  StatusStrip,
  useBenchmarkDashboard,
} from "@/features/benchmark-run";
import { ComparisonSection } from "@/widgets/benchmark-dashboard/sections/comparison-section";
import { ExecutionSection } from "@/widgets/benchmark-dashboard/sections/execution-section";
import { HistorySection } from "@/widgets/benchmark-dashboard/sections/history-section";
import { MonitoringSection } from "@/widgets/benchmark-dashboard/sections/monitoring-section";
import { ResultSection } from "@/widgets/benchmark-dashboard/sections/result-section";
import { SetupSection } from "@/widgets/benchmark-dashboard/sections/setup-section";

export function BenchmarkDashboard() {
  const dashboard = useBenchmarkDashboard();
  const searchParams = useSearchParams();
  const requestedRunId = parseRunId(searchParams.get("runId"));
  const requestedComparisonRunId = parseRunId(searchParams.get("compareRunId"));

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

  useEffect(() => {
    if (
      dashboard.selectedRunId != null &&
      dashboard.selectedRunId === dashboard.comparisonRunId
    ) {
      const nextComparisonRunId =
        dashboard.runs.find((run) => run.id !== dashboard.selectedRunId)?.id ?? null;
      dashboard.setComparisonRunId(nextComparisonRunId);
    }
  }, [
    dashboard.comparisonRunId,
    dashboard.runs,
    dashboard.selectedRunId,
    dashboard.setComparisonRunId,
  ]);

  const selectedRunSummary = findRunSummary(dashboard.runs, dashboard.selectedRunId);

  return (
    <div className="page-stack">
      <section className="page-section">
        <div className="section-head">
          <div>
            <p className="section-label">성능 실험</p>
            <h1 className="page-title page-title--compact">성능 실험 대시보드</h1>
            <p className="page-subtitle">
              동일 조건에서 Java 스레드 모델을 비교하고 결과, 병목, 운영 지표를 함께
              확인합니다.
            </p>
          </div>
        </div>
      </section>

      <StatusStrip
        mode={dashboard.options?.currentMode}
        runCount={dashboard.runs.length}
        selectedRunId={dashboard.selectedRunId}
        comparisonRunId={dashboard.comparisonRunId}
      />

      <SetupSection
        currentMode={dashboard.options?.currentMode}
        apiBaseUrl={dashboard.apiBaseUrl}
        presetTargets={dashboard.presetTargets}
        onApiBaseUrlChange={dashboard.setApiBaseUrl}
        onRefreshConnection={() => void dashboard.refreshConnection()}
        onReloadRuns={() => void dashboard.refreshRuns()}
        form={dashboard.form}
        scenarios={dashboard.options?.scenarios ?? (["mixed"] as Scenario[])}
        isSubmitting={dashboard.isPending || dashboard.isSubmittingRun}
        onFieldChange={(field, value) =>
          dashboard.setForm((current) => ({ ...current, [field]: value }))
        }
        onSubmit={dashboard.submitRun}
      />

      <ExecutionSection
        run={dashboard.selectedRun ?? selectedRunSummary}
        isLoading={dashboard.isLoadingDashboard || dashboard.selectedRunLoading}
        isPolling={dashboard.selectedRunPolling}
        isSubmitting={dashboard.isSubmittingRun}
        isRefreshingRuns={dashboard.isRefreshingRuns}
        message={dashboard.message}
        error={dashboard.error}
      />

      <ResultSection
        run={dashboard.selectedRun}
        isLoading={dashboard.selectedRunLoading}
        isPolling={dashboard.selectedRunPolling}
      />

      <ComparisonSection
        runs={dashboard.runs}
        baselineRun={dashboard.selectedRun}
        comparisonRun={dashboard.comparisonRun}
        baselineRunId={dashboard.selectedRunId}
        comparisonRunId={dashboard.comparisonRunId}
        isBaselineLoading={dashboard.selectedRunLoading}
        isComparisonLoading={dashboard.comparisonRunLoading}
        onBaselineRunIdChange={dashboard.setSelectedRunId}
        onComparisonRunIdChange={dashboard.setComparisonRunId}
      />

      <MonitoringSection />

      <HistorySection
        runs={dashboard.runs}
        selectedRunId={dashboard.selectedRunId}
        onSelectRun={dashboard.setSelectedRunId}
      />
    </div>
  );
}

function parseRunId(value: string | null): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function findRunSummary(
  runs: BenchmarkRunSummaryResponse[],
  runId: number | null,
) {
  if (runId == null) {
    return null;
  }

  return runs.find((run) => run.id === runId) ?? null;
}
