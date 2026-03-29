"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BenchmarkRunSummaryResponse,
  Scenario,
} from "@/entities/benchmark";
import {
  StatusStrip,
  useBenchmarkDashboard,
} from "@/features/benchmark-run";
import { cn } from "@/shared/lib/cn";
import { ComparisonSection } from "@/widgets/benchmark-dashboard/sections/comparison-section";
import { ExecutionSection } from "@/widgets/benchmark-dashboard/sections/execution-section";
import { HistorySection } from "@/widgets/benchmark-dashboard/sections/history-section";
import { MonitoringSection } from "@/widgets/benchmark-dashboard/sections/monitoring-section";
import { ResultSection } from "@/widgets/benchmark-dashboard/sections/result-section";
import { SetupSection } from "@/widgets/benchmark-dashboard/sections/setup-section";

type DashboardViewId =
  | "setup"
  | "execution"
  | "results"
  | "comparison"
  | "monitoring"
  | "history";

const DASHBOARD_VIEWS: Array<{
  id: DashboardViewId;
  label: string;
}> = [
  { id: "setup", label: "Setup" },
  { id: "execution", label: "Run" },
  { id: "results", label: "Results" },
  { id: "comparison", label: "Compare" },
  { id: "monitoring", label: "Monitor" },
  { id: "history", label: "History" },
];

export function BenchmarkDashboard() {
  const dashboard = useBenchmarkDashboard();
  const searchParams = useSearchParams();
  const requestedRunId = parseRunId(searchParams.get("runId"));
  const requestedComparisonRunId = parseRunId(searchParams.get("compareRunId"));
  const [activeView, setActiveView] = useState<DashboardViewId>("setup");

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

  useEffect(() => {
    function syncViewFromLocation() {
      setActiveView(
        resolveDashboardView(window.location.hash, requestedRunId, requestedComparisonRunId),
      );
    }

    syncViewFromLocation();
    window.addEventListener("hashchange", syncViewFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncViewFromLocation);
    };
  }, [requestedComparisonRunId, requestedRunId]);

  const selectedRunSummary = findRunSummary(dashboard.runs, dashboard.selectedRunId);

  function handleViewChange(view: DashboardViewId) {
    setActiveView(view);

    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = view;
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div className="dashboard-console">
      <section className="workspace-toolbar" aria-label="실험 워크스페이스">
        <div className="workspace-tab-list" role="tablist" aria-label="Dashboard views">
          {DASHBOARD_VIEWS.map((view) => (
            <button
              key={view.id}
              id={`dashboard-tab-${view.id}`}
              type="button"
              role="tab"
              aria-selected={activeView === view.id}
              aria-controls={`dashboard-panel-${view.id}`}
              className={cn("workspace-tab", activeView === view.id && "workspace-tab-active")}
              onClick={() => handleViewChange(view.id)}
            >
              {view.label}
            </button>
          ))}
        </div>

        <StatusStrip
          mode={dashboard.options?.currentMode}
          runCount={dashboard.runs.length}
          selectedRunId={dashboard.selectedRunId}
          comparisonRunId={dashboard.comparisonRunId}
        />
      </section>

      <section
        id={`dashboard-panel-${activeView}`}
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${activeView}`}
        className="workspace-stage"
      >
        {activeView === "setup" ? (
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
        ) : null}

        {activeView === "execution" ? (
          <ExecutionSection
            run={dashboard.selectedRun ?? selectedRunSummary}
            isLoading={dashboard.isLoadingDashboard || dashboard.selectedRunLoading}
            isPolling={dashboard.selectedRunPolling}
            isSubmitting={dashboard.isSubmittingRun}
            isRefreshingRuns={dashboard.isRefreshingRuns}
            message={dashboard.message}
            error={dashboard.error}
          />
        ) : null}

        {activeView === "results" ? (
          <ResultSection
            run={dashboard.selectedRun}
            isLoading={dashboard.selectedRunLoading}
            isPolling={dashboard.selectedRunPolling}
          />
        ) : null}

        {activeView === "comparison" ? (
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
        ) : null}

        {activeView === "monitoring" ? <MonitoringSection compact /> : null}

        {activeView === "history" ? (
          <HistorySection
            runs={dashboard.runs}
            selectedRunId={dashboard.selectedRunId}
            onSelectRun={dashboard.setSelectedRunId}
            onOpenResults={() => handleViewChange("results")}
          />
        ) : null}
      </section>
    </div>
  );
}

function resolveDashboardView(
  hash: string,
  requestedRunId: number | null,
  requestedComparisonRunId: number | null,
): DashboardViewId {
  const normalizedHash = hash.replace("#", "").trim();

  if (isDashboardViewId(normalizedHash)) {
    return normalizedHash;
  }

  if (requestedComparisonRunId != null) {
    return "comparison";
  }

  if (requestedRunId != null) {
    return "results";
  }

  return "setup";
}

function isDashboardViewId(value: string): value is DashboardViewId {
  return DASHBOARD_VIEWS.some((view) => view.id === value);
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
