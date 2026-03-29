import { getMonitoringLinks } from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function ObservabilityLinksPanel() {
  const links = getMonitoringLinks();

  return (
    <Panel className="observability-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h3>운영 링크</h3>
          <p className="panel-copy">
            원시 메트릭, 백엔드 엔드포인트, 스텁 서버 접근 링크를 제공합니다.
          </p>
        </div>
        <span className="panel-copy">{links.length}개 링크</span>
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
            <div>
              <strong>{link.title}</strong>
              <p>{link.description}</p>
            </div>
            <span className="link-highlight">{link.highlight}</span>
          </a>
        ))}
      </div>
    </Panel>
  );
}
