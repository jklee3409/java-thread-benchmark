import {
  Scenario,
  scenarioLabel,
  threadModeLabel,
} from "@/entities/benchmark";
import {
  RunConfigForm,
  RunFormState,
  TargetConnectionPanel,
} from "@/features/benchmark-run";
import { Panel } from "@/shared/ui/panel";

type SetupSectionProps = {
  currentMode: string | undefined;
  apiBaseUrl: string;
  presetTargets: Array<{
    label: string;
    url: string;
  }>;
  onApiBaseUrlChange: (value: string) => void;
  onRefreshConnection: () => void;
  onReloadRuns: () => void;
  form: RunFormState;
  scenarios: Scenario[];
  isSubmitting: boolean;
  onFieldChange: <K extends keyof RunFormState>(field: K, value: RunFormState[K]) => void;
  onSubmit: () => Promise<void>;
};

export function SetupSection({
  currentMode,
  apiBaseUrl,
  presetTargets,
  onApiBaseUrlChange,
  onRefreshConnection,
  onReloadRuns,
  form,
  scenarios,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: SetupSectionProps) {
  return (
    <section className="dashboard-section" id="setup">
      <div className="setup-layout">
        <TargetConnectionPanel
          apiBaseUrl={apiBaseUrl}
          presetTargets={presetTargets}
          onApiBaseUrlChange={onApiBaseUrlChange}
          onRefreshConnection={onRefreshConnection}
          onReloadRuns={onReloadRuns}
        />

        <div className="section-stack">
          <RunConfigForm
            form={form}
            scenarios={scenarios}
            isPending={isSubmitting}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
          />

          <Panel className="setup-side-panel">
            <div className="panel-head">
              <h3>Snapshot</h3>
            </div>

            <div className="setup-stat-grid">
              <div className="setup-stat">
                <span>Mode</span>
                <strong>{threadModeLabel(currentMode)}</strong>
              </div>
              <div className="setup-stat">
                <span>Scenario</span>
                <strong>{scenarioLabel(form.scenario)}</strong>
              </div>
              <div className="setup-stat">
                <span>Threads</span>
                <strong>{form.threadCount || "-"}</strong>
              </div>
              <div className="setup-stat">
                <span>Duration</span>
                <strong>{form.durationSeconds ? `${form.durationSeconds}s` : "-"}</strong>
              </div>
            </div>

            <div className="setup-hint-card">
              <span>API</span>
              <strong>{apiBaseUrl}</strong>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
