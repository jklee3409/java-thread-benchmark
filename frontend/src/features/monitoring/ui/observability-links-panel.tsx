import { getMonitoringLinks } from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function ObservabilityLinksPanel() {
  const links = getMonitoringLinks();

  return (
    <Panel className="observability-panel">
      <div className="panel-head panel-head--spread">
        <h3>Links</h3>
        <span className="panel-copy">{links.length}</span>
      </div>

      <div className="link-grid">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="monitoring-link-card"
          >
            <strong>{link.title}</strong>
            <span className="link-highlight">{link.highlight}</span>
          </a>
        ))}
      </div>
    </Panel>
  );
}
