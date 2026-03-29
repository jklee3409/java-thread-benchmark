import { MonitoringSection } from "@/widgets/benchmark-dashboard/sections/monitoring-section";

export default function MonitoringPage() {
  return (
    <div className="page-stack">
      <section className="panel page-intro page-intro--compact">
        <div className="page-heading">
          <p className="section-label">모니터링</p>
          <h1 className="page-title page-title--compact">실시간 추적</h1>
          <p className="page-subtitle">
            성능 실험과 동일한 대상 기준으로 Grafana, Prometheus, 백엔드 엔드포인트를
            확인합니다.
          </p>
        </div>
      </section>

      <MonitoringSection />
    </div>
  );
}
