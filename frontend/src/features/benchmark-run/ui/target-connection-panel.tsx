import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/panel";

type TargetConnectionPanelProps = {
  apiBaseUrl: string;
  presetTargets: Array<{
    label: string;
    url: string;
  }>;
  onApiBaseUrlChange: (value: string) => void;
  onRefreshConnection: () => void;
  onReloadRuns: () => void;
};

export function TargetConnectionPanel({
  apiBaseUrl,
  presetTargets,
  onApiBaseUrlChange,
  onRefreshConnection,
  onReloadRuns,
}: TargetConnectionPanelProps) {
  return (
    <Panel className="target-panel">
      <div className="panel-head">
        <h3>Target</h3>
      </div>

      <div className="target-grid">
        {presetTargets.map((target) => (
          <button
            key={target.url}
            type="button"
            className={cn("target-option", apiBaseUrl === target.url && "target-option-active")}
            onClick={() => onApiBaseUrlChange(target.url)}
          >
            <span>{target.label}</span>
            <strong>{target.url}</strong>
          </button>
        ))}
      </div>

      <label className="field">
        <span className="field-label">API</span>
        <input
          value={apiBaseUrl}
          onChange={(event) => onApiBaseUrlChange(event.target.value)}
          placeholder="http://localhost:8080"
          className="field-control"
        />
      </label>

      <div className="panel-actions">
        <button type="button" className="secondary" onClick={onRefreshConnection}>
          Refresh
        </button>
        <button type="button" className="secondary" onClick={onReloadRuns}>
          Runs
        </button>
      </div>
    </Panel>
  );
}
