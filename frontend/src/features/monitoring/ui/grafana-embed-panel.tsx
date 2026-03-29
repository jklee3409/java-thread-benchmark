import {
  getGrafanaDashboardUrl,
  getGrafanaEmbedUrl,
} from "@/features/monitoring/model/grafana-links";
import { Panel } from "@/shared/ui/panel";

export function GrafanaEmbedPanel() {
  return (
    <Panel className="grafana-panel" id="monitoring">
      <div className="panel-head panel-head--spread">
        <div>
          <h2>실시간 대시보드</h2>
          <p className="panel-copy">
            여기서 추세를 보고, 더 자세한 탐색이 필요하면 전체 화면으로 전환하세요.
          </p>
        </div>
        <a
          href={getGrafanaDashboardUrl()}
          target="_blank"
          rel="noreferrer"
          className="ghost-link"
        >
          전체 화면으로 열기
        </a>
      </div>

      <div className="grafana-frame-shell">
        <iframe
          title="Grafana 스레드 벤치마크 대시보드"
          src={getGrafanaEmbedUrl()}
          className="grafana-frame"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </Panel>
  );
}
