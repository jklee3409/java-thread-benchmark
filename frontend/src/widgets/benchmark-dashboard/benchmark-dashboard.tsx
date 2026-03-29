"use client";

import { Scenario } from "@/entities/benchmark";
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
  GrafanaEmbedPanel,
  ObservabilityLinksPanel,
} from "@/features/monitoring";
import { SiteHeader } from "@/shared/ui/site-header";

export function BenchmarkDashboard() {
  const dashboard = useBenchmarkDashboard();

  return (
    <main className="dashboard-shell">
      <SiteHeader current="dashboard" />

      <section className="hero">
        <div>
          <p className="eyebrow">JAVA 21 THREAD BENCHMARK CONSOLE</p>
          <h1>Platform Thread / Virtual Thread benchmark console</h1>
          <p className="subtitle">
            Trigger JMeter runs, capture DB and external I/O contention, and compare VT/PT
            behavior from one operational console.
          </p>
        </div>

        <TargetConnectionPanel
          apiBaseUrl={dashboard.apiBaseUrl}
          presetTargets={dashboard.presetTargets}
          onApiBaseUrlChange={dashboard.setApiBaseUrl}
          onRefreshConnection={() => void dashboard.refreshConnection()}
          onReloadRuns={() => void dashboard.refreshRuns()}
        />
      </section>

      <StatusStrip
        mode={dashboard.options?.currentMode}
        runCount={dashboard.runs.length}
        selectedRunId={dashboard.selectedRunId}
        comparisonRunId={dashboard.comparisonRunId}
        message={dashboard.message}
        error={dashboard.error}
      />

      <ObservabilityLinksPanel />

      <section className="grid">
        <RunConfigForm
          form={dashboard.form}
          scenarios={dashboard.options?.scenarios ?? (["mixed"] as Scenario[])}
          isPending={dashboard.isPending}
          onFieldChange={(field, value) =>
            dashboard.setForm((current) => ({ ...current, [field]: value }))
          }
          onSubmit={dashboard.submitRun}
        />

        <RunHistoryList
          runs={dashboard.runs}
          selectedRunId={dashboard.selectedRunId}
          onSelectRun={dashboard.setSelectedRunId}
        />
      </section>

      <section className="detail-grid">
        <RunDetailPanel run={dashboard.selectedRun} />
        <LayerMetricsTable metrics={dashboard.selectedRun?.layerMetrics ?? []} />
      </section>

      <section className="detail-grid detail-grid--secondary">
        <RunComparisonPanel
          runs={dashboard.runs}
          baselineRun={dashboard.selectedRun}
          comparisonRun={dashboard.comparisonRun}
          comparisonRunId={dashboard.comparisonRunId}
          onComparisonRunIdChange={dashboard.setComparisonRunId}
        />
        <GrafanaEmbedPanel />
      </section>
    </main>
  );
}
