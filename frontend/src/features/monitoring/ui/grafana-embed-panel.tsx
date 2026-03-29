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
          <h3>Grafana 대시보드</h3>
          <p className="panel-copy">
            실시간 메트릭은 임베드 화면으로 보고, 상세 탐색은 새 탭에서 이어갑니다.
          </p>
        </div>
        <a
          href={getGrafanaDashboardUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="primary"
        >
          Grafana 열기
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
