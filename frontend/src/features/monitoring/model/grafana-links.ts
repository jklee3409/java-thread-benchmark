import {
  DEFAULT_API_BASE_URL,
  DEFAULT_GRAFANA_BASE_URL,
  DEFAULT_GRAFANA_DASHBOARD_SLUG,
  DEFAULT_GRAFANA_DASHBOARD_UID,
  DEFAULT_PLATFORM_API_BASE_URL,
  DEFAULT_PROMETHEUS_BASE_URL,
  DEFAULT_VIRTUAL_API_BASE_URL,
  DEFAULT_WIREMOCK_BASE_URL,
} from "@/shared/constants/runtime";

export type MonitoringLink = {
  title: string;
  description: string;
  href: string;
  highlight: string;
};

export function getGrafanaDashboardUrl(): string {
  return `${trimTrailingSlash(DEFAULT_GRAFANA_BASE_URL)}/d/${DEFAULT_GRAFANA_DASHBOARD_UID}/${DEFAULT_GRAFANA_DASHBOARD_SLUG}?orgId=1`;
}

export function getGrafanaEmbedUrl(): string {
  return `${getGrafanaDashboardUrl()}&kiosk=tv&theme=light`;
}

export function getMonitoringLinks(): MonitoringLink[] {
  return [
    {
      title: "Grafana 대시보드",
      description:
        "HTTP, DB, Redis, 외부 API, HikariCP, JVM 스레드 지표를 한 화면에서 비교합니다.",
      href: getGrafanaDashboardUrl(),
      highlight: "Grafana",
    },
    {
      title: "Prometheus",
      description: "원시 메트릭과 스크레이프 상태를 직접 확인할 수 있습니다.",
      href: DEFAULT_PROMETHEUS_BASE_URL,
      highlight: "메트릭",
    },
    {
      title: "플랫폼 스레드 API",
      description: "플랫폼 스레드 백엔드로 직접 접근하는 엔드포인트입니다.",
      href: DEFAULT_PLATFORM_API_BASE_URL,
      highlight: "8080",
    },
    {
      title: "버추얼 스레드 API",
      description: "버추얼 스레드 백엔드로 직접 접근하는 엔드포인트입니다.",
      href: DEFAULT_VIRTUAL_API_BASE_URL,
      highlight: "8081",
    },
    {
      title: "WireMock",
      description: "느린 외부 API와 오류 상황을 재현하는 모의 서버입니다.",
      href: DEFAULT_WIREMOCK_BASE_URL,
      highlight: "모의 API",
    },
    {
      title: "기본 GUI 대상",
      description: "현재 대시보드가 기본값으로 연결하는 백엔드 대상입니다.",
      href: DEFAULT_API_BASE_URL,
      highlight: "기본값",
    },
  ];
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
