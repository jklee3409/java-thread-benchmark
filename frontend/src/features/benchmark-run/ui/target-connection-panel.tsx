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
    <div className="target-panel">
      <label className="field">
        <span>Backend API Base URL</span>
        <input
          value={apiBaseUrl}
          onChange={(event) => onApiBaseUrlChange(event.target.value)}
          placeholder="http://localhost:8080"
        />
      </label>
      <div className="target-presets">
        {presetTargets.map((target) => (
          <button
            key={target.url}
            type="button"
            className={apiBaseUrl === target.url ? "secondary is-active" : "secondary"}
            onClick={() => onApiBaseUrlChange(target.url)}
          >
            {target.label}
          </button>
        ))}
      </div>
      <div className="target-actions">
        <button type="button" className="primary" onClick={onRefreshConnection}>
          Refresh connection
        </button>
        <button type="button" className="secondary" onClick={onReloadRuns}>
          Reload runs
        </button>
      </div>
    </div>
  );
}
