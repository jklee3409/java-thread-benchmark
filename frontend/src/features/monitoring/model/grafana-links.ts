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
        "HTTP, DB, Redis, 외부 API, HikariCP, JVM 스레드 지표를 한 화면에서 확인합니다.",
      href: getGrafanaDashboardUrl(),
      highlight: "Grafana",
    },
    {
      title: "Prometheus",
      description: "원시 메트릭과 scrape 상태를 직접 확인합니다.",
      href: DEFAULT_PROMETHEUS_BASE_URL,
      highlight: "Metrics",
    },
    {
      title: "Platform Thread API",
      description: "플랫폼 스레드 백엔드 엔드포인트입니다.",
      href: DEFAULT_PLATFORM_API_BASE_URL,
      highlight: "8080",
    },
    {
      title: "Virtual Thread API",
      description: "가상 스레드 백엔드 엔드포인트입니다.",
      href: DEFAULT_VIRTUAL_API_BASE_URL,
      highlight: "8081",
    },
    {
      title: "WireMock",
      description: "외부 API 지연과 오류를 재현하는 모의 서버입니다.",
      href: DEFAULT_WIREMOCK_BASE_URL,
      highlight: "Stub",
    },
    {
      title: "기본 API 대상",
      description: "현재 프런트엔드가 기본값으로 사용하는 백엔드 주소입니다.",
      href: DEFAULT_API_BASE_URL,
      highlight: "Default",
    },
  ];
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
