import { getMonitoringLinks } from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function ObservabilityLinksPanel() {
  const links = getMonitoringLinks();

  return (
    <Panel className="observability-panel">
      <div className="panel-head">
        <h2>Observability Shortcuts</h2>
        <span>{links.length} endpoints</span>
      </div>

      <div className="observability-links">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="observability-link-card"
          >
            <div>
              <strong>{link.title}</strong>
              <p>{link.description}</p>
            </div>
            <span>{link.highlight}</span>
          </a>
        ))}
      </div>
    </Panel>
  );
}
