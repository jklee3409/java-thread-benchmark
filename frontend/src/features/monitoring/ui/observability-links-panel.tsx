import { getMonitoringLinks } from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function ObservabilityLinksPanel() {
  const links = getMonitoringLinks();

  return (
    <Panel className="observability-panel">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>분석 도구</h2>
          <p className="panel-copy">
            요약만으로 부족할 때 바로 내려갈 수 있는 외부 도구들입니다.
          </p>
        </div>
        <span>{links.length}개</span>
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
