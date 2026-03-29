import {
  getGrafanaDashboardUrl,
  getGrafanaEmbedUrl,
} from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function GrafanaEmbedPanel() {
  return (
    <Panel className="grafana-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>Grafana Monitoring</h2>
          <p className="panel-copy">
            Open the provisioned dashboard or inspect it directly inside the benchmark console.
          </p>
        </div>
        <a
          href={getGrafanaDashboardUrl()}
          target="_blank"
          rel="noreferrer"
          className="ghost-link"
        >
          Open full dashboard
        </a>
      </div>

      <div className="grafana-frame-shell">
        <iframe
          title="Grafana Thread Benchmark Dashboard"
          src={getGrafanaEmbedUrl()}
          className="grafana-frame"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </Panel>
  );
}
