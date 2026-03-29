import Link from "next/link";
import {
  GrafanaEmbedPanel,
  ObservabilityLinksPanel,
} from "@/features/monitoring";

export function MonitoringSection() {
  return (
    <section className="dashboard-section" id="monitoring">
      <div className="section-head section-head--spread">
        <div>
          <p className="section-label">모니터링</p>
          <h2>실시간 추적</h2>
          <p className="section-subtitle">
            Grafana 대시보드를 중심으로 JVM, DB, Redis, 외부 API 지표를 운영 화면처럼
            확인합니다.
          </p>
        </div>
        <Link href="/monitoring" className="secondary">
          전용 화면 열기
        </Link>
      </div>

      <div className="section-stack">
        <GrafanaEmbedPanel />
        <ObservabilityLinksPanel />
      </div>
    </section>
  );
}
